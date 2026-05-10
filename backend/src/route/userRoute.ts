import express from "express";
import {
  getProfile,
  loginUser,
  registerAdmin,
  requestResetPassword,
  updateProfile,
  resetPassword,
} from "../controller/authController.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { varification } from "../middleware/validateInput.middleware.js";
import { rateLimiter } from "../middleware/rateLimite.middleware.js";

const authRouter = express.Router();

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adminName:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [admin, staff]
 *                 address:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
authRouter.get("/me", authMiddleware, getProfile);
/**
 * @swagger
 * /api/auth/register/admin:
 *   post:
 *     summary: Register a new admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminName
 *               - phoneNumber
 *               - password
 *               - role
 *               - address
 *             properties:
 *               adminName:
 *                 type: string
 *                 example: Aditya
 *               phoneNumber:
 *                 type: string
 *                 example: 1234567890
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum: [admin, staff]
 *                 example: admin
 *               address:
 *                 type: string
 *                 example: "City, Country"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
authRouter.post("/register/admin", varification, rateLimiter, registerAdmin);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - password
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: 1234567890
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
authRouter.post("/login", rateLimiter, loginUser);

/**
 * @swagger
 * /api/auth/update/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
authRouter.post("/request-reset-password", requestResetPassword);
authRouter.post("/reset-pass", resetPassword);
authRouter.patch(
  "/update/profile",
  authMiddleware,
  varification,
  updateProfile,
);

export default authRouter;
