// GET    /api/dashboard/stats      // Get statistics
// GET    /api/reports/client/:id   // Client-wise report

import express from "express";
import { getStatistics } from "../controller/dashboardController.ts";
import authMiddleware from "../middleware/auth.middleware.ts";

const dashboardRouter = express.Router();
dashboardRouter.use(authMiddleware);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEntries:
 *                   type: integer
 *                   example: 100
 *                 totalAmount:
 *                   type: number
 *                   example: 5000.75
 *                 paidEntries:
 *                   type: integer
 *                   example: 80
 *                 unpaidEntries:
 *                   type: integer
 *                   example: 20   
 */
dashboardRouter.get("/stats", getStatistics);

export default dashboardRouter;