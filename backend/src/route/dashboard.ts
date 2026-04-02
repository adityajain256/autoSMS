// GET    /api/dashboard/stats      // Get statistics
// GET    /api/reports/client/:id   // Client-wise report

import express from "express";
import { getStatistics } from "../controller/dashboardController.ts";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats", getStatistics);

export default dashboardRouter;