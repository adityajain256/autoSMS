// POST   /api/auth/register        // Register CA/Staff
// POST   /api/auth/login           // Login
// POST   /api/auth/logout          // Logout
// GET    /api/auth/me 

import express from "express";
import { getProfile, getStaff, loginUser, register_staff, registerAdmin, updateProfile } from "../controller/authController.ts";
import authMiddleware from "../middleware/auth.middlware.ts";
const authRouter = express.Router();

authRouter.use(authMiddleware);

authRouter.get("/me", getProfile);
authRouter.post("/register-admin", registerAdmin);
authRouter.post("/register-staff", register_staff);
authRouter.post("/login", loginUser);

authRouter.patch("/update-profile", updateProfile);

authRouter.get("/get-staff", getStaff);

export default authRouter;