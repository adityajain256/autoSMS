import type { IUser } from "../types/index.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  createUser,
  getUser,
  loginUser,
  updateUser,
} from "../reposatory/userRepo.ts";
import logger from "../utils/logger.ts";
import redisClient from "../config/redis.ts";
// import { otp, otpTemplate } from "../utils/otpGenerator.ts";
// import { sendMail } from "../config/mail.ts";
// import validators from "../utils/validators.ts";

type IUserWithOptionalFields = IUser & {
  id?: string;
  password?: string;
};

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
    const userId = newUser.data?._id;
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
        2 * 60 * 60,
        String(user.user.petrolPumpName),
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
