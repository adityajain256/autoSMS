import express from "express";
import {
  getUserService,
  loginUserService,
  registerUserService,
  updateUserService,
} from "../service/userService.ts";
import type { IUser } from "../types/index.js";

export const registerAdmin = async (
  req: express.Request,
  res: express.Response,
) => {
  const { adminName, password, email, phoneNumber, address, petrolPumpName } =
    req.body;

  try {
    const data = {
      name: adminName,
      password: password,
      email: email,
      phoneNumber: phoneNumber,
      address,
      petrolPumpName,
    };

    const user = await registerUserService(data as unknown as IUser);
    const token = user?.token;
    if (user.success === false || !token) {
      return res
        .status(400)
        .json({ message: user.error || "Failed to register admin." });
    }
    return res
      .status(201)
      .json({ message: "Admin registered successfully.", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while registering the admin." });
  }
};

export const loginUser = async (
  req: express.Request,
  res: express.Response,
) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await loginUserService({ phoneNumber, password } as IUser);
    if (!user.success || !user.token) {
      return res
        .status(400)
        .json({ message: user.error || "Failed to login user." });
    }
    const token = user.token;
    return res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while logging in." });
  }
};

export const updateProfile = async (
  req: express.Request,
  res: express.Response,
) => {
  const { adminName, address, englishWelcomeSMS, hindiWelcomeSMS } = req.body;

  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user information found in token." });
    }

    const user = await updateUserService(
      { name: adminName, address, englishWelcomeSMS, hindiWelcomeSMS } as IUser,
      userId,
    );
    console.log(user.data);
    if (!user.success || !user.data) {
      return res
        .status(400)
        .json({ message: user.error || "Failed to update profile." });
    }
    return res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while updating the profile." });
  }
};

export const getProfile = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    if (!(req as any).user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user information found in token." });
    }
    const userId = (req as any).user.id;
    const user = await getUserService(userId);
    if (!user.success || !user.data) {
      return res
        .status(400)
        .json({ message: user.error || "Failed to fetch profile." });
    }
    const admin = user.data;

    if (!admin) {
      return res.status(404).json({ message: "user not found." });
    }
    return res.status(200).json({
      admin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the profile." });
  }
};
