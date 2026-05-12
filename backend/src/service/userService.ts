import type { IUser } from "../types/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  createUser,
  getUser,
  getUserByMail,
  loginUser,
  updateUser,
} from "../reposatory/userRepo.js";
import logger from "../utils/logger.js";
import redisClient from "../config/redis.js";
import { sendMail } from "../config/mail.js";
import {
  generateOtpTemplateForMail,
  generatePasswordResetTemplateForMail,
} from "../utils/templates.js";
import { success } from "zod";

// import { otp, otpTemplate } from "../utils/otpGenerator.js";
// import { sendMail } from "../config/mail.js";
// import validators from "../utils/validators.js";

export const registerUserService = async (data: IUser) => {
  try {
    // varification of email.
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not set");
    }

    const hashedPassword = await bcrypt.hash(String(data.password), 10);

    let phoneNumberWithCountryCode = String(data.phoneNumber);
    if (!phoneNumberWithCountryCode.startsWith("+91")) {
      phoneNumberWithCountryCode = `+91${phoneNumberWithCountryCode}`;
    }

    const newUser = await createUser({
      name: data.name,
      password: String(hashedPassword),
      email: data.email,
      phoneNumber: phoneNumberWithCountryCode,
      address: data.address,
      petrolPumpName: data.petrolPumpName,
    } as IUser);
    if (!newUser.success || !newUser.data) {
      return {
        success: false,
        error: newUser.error || "Failed to create user",
      };
    }
    const userId: string = String(newUser.data?._id);
    if (!userId) {
      throw new Error("User ID is missing after user creation");
    }

    const token = jwt.sign({ id: userId.toString() }, jwtSecret, {
      expiresIn: "7d",
    });
    await redisClient.setEx(
      `user:${userId}:petrolPumpName`,
      7 * 24 * 60 * 60,
      String(data?.petrolPumpName),
    );
    await redisClient.setEx(
      `user:${userId}:email`,
      7 * 24 * 60 * 60,
      String(data.email),
    );
    await redisClient.setEx(
      `user:${userId}:address`,
      7 * 24 * 60 * 60,
      String(data.address),
    );
    const otp: string = String(
      Math.floor(
        Math.random() * (Math.pow(10, 6) - 1 - Math.pow(10, 5)) +
          Math.pow(10, 5),
      ),
    );
    await updateUser({ otp: otp }, userId);
    await sendMail(
      String(data.email),
      "Welcome to LIGHTLEAF",
      generateOtpTemplateForMail(otp),
    );
    logger.info("User registered successfully.");
    return { user: newUser, token };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      error: "An error occurred while registering the user.",
    };
  }
};

export const verifyUserByOTPServices = async (otp: string, email: string) => {
  try {
    const user = await getUserByMail(email as string);
    if (!user.success || !user.data) {
      return { success: false, error: user.error || "Invalid OTP" };
    }
    if (user.data.otp !== otp) {
      return { success: false, message: "OTP doesn't match." };
    }
    await updateUser(
      { verified: true, otp: "" } as IUser,
      String(user.data._id),
    );
    return { success: true, message: "OTP verified successfully." };
  } catch (error) {
    return {
      success: false,
      error: "An error occurred while registering the user.",
    };
  }
};

export const generateOTPService = async (email: string) => {
  try {
    const user = await getUserByMail(email);
    if (!user.success || !user.data) {
      return { success: false, error: user.error || "No user found." };
    }
    if (user.data.verified === true) {
      return { success: false, message: "User already verified." };
    }
    const otp: string = String(
      Math.floor(
        Math.random() * (Math.pow(10, 6) - 1 - Math.pow(10, 5)) +
          Math.pow(10, 5),
      ),
    );
    await updateUser({ otp: otp } as IUser, String(user.data._id));
    await sendMail(
      String(user.data.email),
      "Your OTP for LIGHTLEAF",
      generateOtpTemplateForMail(otp),
    );
    logger.info(`OTP generated and sent to ${user.data.email} OTP: ${otp}`);
    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      error: "An error occurred while generating the OTP.",
    };
  }
};

export const loginUserService = async (data: IUser) => {
  try {
    let phoneNumberWithCountryCode = String(data.phoneNumber);
    if (!phoneNumberWithCountryCode.startsWith("+91")) {
      phoneNumberWithCountryCode = `+91${phoneNumberWithCountryCode}`;
    }
    const password = String(data.password);

    const user = await loginUser(phoneNumberWithCountryCode);
    if (!user.success || !user.user?.password) {
      return { success: false, error: user.error || "Failed to find user" };
    }

    const isMatch = await bcrypt.compare(password, String(user.user.password));
    if (!isMatch) {
      return { success: false, message: "invalid credential" };
    }

    const jwtSecret =
      process.env.JWT_SECRET ||
      (() => {
        throw new Error("JWT_SECRET environment variable is not set");
      })();
    const token = jwt.sign({ id: user.user._id }, jwtSecret, {
      expiresIn: "7d",
    });
    const petrolPump = await redisClient.get(
      `user:${user.user._id}:petrolPumpName`,
    );
    if (!petrolPump) {
      await redisClient.setEx(
        `user:${user.user._id}:petrolPumpName`,
        7 * 24 * 60 * 60,
        String(user.user.petrolPumpName),
      );
    }
    const address = await redisClient.get(`user:${user.user._id}:address`);
    if (!address) {
      await redisClient.setEx(
        `user:${user.user._id}:address`,
        7 * 24 * 60 * 60,
        String(user.user.address),
      );
    }

    const email = await redisClient.get(`user:${user.user._id}:email`);
    if (!email) {
      await redisClient.setEx(
        `user:${user.user._id}:email`,
        7 * 24 * 60 * 60,
        String(user.user.email),
      );
    }

    logger.info("User logged in successfully.");
    return { success: true, token };
  } catch (error) {
    logger.error(error);
    return {
      success: false,
      error: "An error occurred while logging in the user.",
    };
  }
};

export const getUserService = async (id: string) => {
  try {
    const user = await getUser(id);
    if (!user.success || !user.data) {
      return { success: false, error: user.error || "Failed to find user" };
    }
    return { success: true, data: user.data };
  } catch (error) {
    logger.error(error);
    return { success: false, error: error };
  }
};

export const updateUserService = async (data: IUser, userId: string) => {
  try {
    const user = await updateUser(data, userId);
    if (!user.success || !user.data) {
      return { success: false, error: user.error || "Failed to update user" };
    }
    return { success: true, data: user.data };
  } catch (error) {
    logger.error(`Error occurred while updating user in service: ${error}`);
    return {
      success: false,
      error: "An error occurred while updating the user.",
    };
  }
};

export const requestResetPasswordService = async (email: string) => {
  try {
    const user = await getUserByMail(email);
    if (!user.success || !user.data) {
      return { success: false, error: user.error || "No user found." };
    }
    const secret = String(process.env.JWT_SECRET) + user.data.password;
    const payload = {
      userId: user.data._id,
    };
    const uniqueToken = jwt.sign(payload, secret, {
      expiresIn: 3600,
    });
    await updateUser(
      { resetToken: uniqueToken } as IUser,
      String(user.data._id),
    );
    const url: string = `${String(process.env.FRONTEND_URL)}/reset-password?token=${uniqueToken}&id=${user.data._id}`;
    const mailBody = generatePasswordResetTemplateForMail(url);
    const res = sendMail(
      String(user.data.email),
      "Password Reset LIGHTLEAF",
      mailBody,
    );
    if (res == undefined) {
      logger.info(`Password reset email sent to ${user.data.email}`);
    } else {
      logger.error(
        `Failed to send password reset email to ${user.data.email} response: ${String(res)}`,
      );
    }
    return { success: true, message: "Password reset email sent." };
  } catch (error) {
    return {
      success: false,
      error: "An error occurred while requesting password reset in service.",
    };
  }
};

export const resetPasswordService = async (
  userId: string,
  token: string,
  password: string,
) => {
  try {
    const user = await getUser(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }
    const secret = String(process.env.JWT_SECRET) + user.data?.password;
    const isVerified = jwt.verify(String(token), secret);

    if (!isVerified) {
      return { success: false, message: "token expired" };
    }
    const hashedPass = await bcrypt.hash(password, 10);

    await updateUser({ password: hashedPass }, userId);

    return { success: true, message: "Password updated successfully." };
  } catch (error) {
    return {
      success: false,
      error: "An error occurred while requesting password reset in service.",
    };
  }
};
