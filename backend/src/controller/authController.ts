import Admin from "../model/Auth.ts";
import validators from "../utils/validators.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import express from "express";
import excel from "exceljs";

export const registerAdmin = async (
  req: express.Request,
  res: express.Response,
) => {
  const { adminName, password, role, phoneNumber, address, petrolPumpName } =
    req.body;

  const re: string = validators.validatePassword(password);
  if (validators.validatePhoneNumber(phoneNumber) === false) {
    return res.status(400).json({ message: "Invalid phone number format." });
  }
  if (re !== "OK") {
    return res.status(400).json({ message: re });
  }
  if (!validators.validateUsername(adminName)) {
    return res
      .status(400)
      .json({ message: "Username must be between 1 and 30 characters long." });
  }
  if (role !== "admin" && role !== "staff") {
    return res
      .status(400)
      .json({ message: "Role must be either 'admin' or 'staff'." });
  }
  try {
    const existingAdmin = await Admin.find({ adminName });
    if (existingAdmin.length > 0) {
      return res
        .status(400)
        .json({ message: "Admin with this username already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret)
      throw new Error("JWT_SECRET environment variable is not set");

    const newAdmin = await Admin.create({
      adminName,
      password: hashedPassword,
      role,
      phoneNumber: `+91${phoneNumber}`,
      address: address,
      petrolPumpName,
    });

    const token = jwt.sign({ id: newAdmin.id }, jwtSecret, {
      expiresIn: "7d",
    });
    return res
      .status(201)
      .json({ message: "Admin registered successfully.", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while registering the admin." });
  }
};

export const register_staff = async (
  req: express.Request,
  res: express.Response,
) => {
  const { staffName, password, role, phoneNumber, address } = req.body;

  const re: string = validators.validatePassword(password);

  if (re !== "OK") {
    return res.status(400).json({ message: re });
  }
  if (!validators.validateUsername(staffName)) {
    return res
      .status(400)
      .json({ message: "Username must be between 1 and 30 characters long." });
  }
  if (role !== "admin" && role !== "staff") {
    return res
      .status(400)
      .json({ message: "Role must be either 'admin' or 'staff'." });
  }
  try {
    const admin = await Admin.findById((req as any).user.id);
    if (admin?.role !== "admin") {
      // Debug log removed for production safety
      return res
        .status(403)
        .json({ message: "Forbidden: Only admins can register staff." });
    }
    const existingAdmin = await Admin.find({ staffName });
    if (existingAdmin.length > 0) {
      return res
        .status(400)
        .json({ message: "Admin with this username already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      adminName: staffName,
      password: hashedPassword,
      role,
      phoneNumber: `+91${phoneNumber}`,
      address: address,
    });

    const jwtSecret =
      process.env.JWT_SECRET ||
      (() => {
        throw new Error("JWT_SECRET environment variable is not set");
      })();
    const token = jwt.sign({ id: newAdmin.id }, jwtSecret, {
      expiresIn: "24h",
    });

    return res
      .status(201)
      .json({ message: `${staffName} registered successfully.`, token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while registering the staff." });
  }
};

export const loginUser = async (
  req: express.Request,
  res: express.Response,
) => {
  const { phoneNumber, password } = req.body;

  try {
    const admin = await Admin.findOne({ phoneNumber: `+91${phoneNumber}` });
    if (!admin) {
      return res.status(404).json({ message: "invalid credential" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalid credential" });
    }

    const jwtSecret =
      process.env.JWT_SECRET ||
      (() => {
        throw new Error("JWT_SECRET environment variable is not set");
      })();
    const token = jwt.sign({ id: admin.id }, jwtSecret, { expiresIn: "7d" });
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
  const { password, adminName, address, englishWelcomeSMS, hindiWelcomeSMS } =
    req.body;
  if (password) {
    const re: string = validators.validatePassword(password);
    if (re !== "OK") {
      return res.status(400).json({ message: re });
    }
  }
  try {
    if (!(req as any).user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user information found in token." });
    }
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const admin = await Admin.findByIdAndUpdate(
      (req as any).user.id,
      {
        password: hashedPassword,
        adminName,
        address,
        englishWelcomeSMS,
        hindiWelcomeSMS,
      },
      { returnDocument: "after" },
    );
    if (!admin) {
      return res.status(404).json({ message: "user not found." });
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

    const admin = await Admin.findById((req as any).user.id).select(
      "-password",
    );

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

export const getStaff = async (req: express.Request, res: express.Response) => {
  try {
    const user = await Admin.findById((req as any).user.id);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only admins can view staff members." });
    }

    const staffMembers = await Admin.find({ role: "staff" }).select(
      "-password",
    );
    return res.status(200).json(staffMembers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while fetching staff members." });
  }
};
