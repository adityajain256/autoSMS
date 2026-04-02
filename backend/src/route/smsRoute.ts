// SMS Management
// POST   /api/sms/retry/:entryId   // Retry failed SMS
// GET    /api/sms/status/:entryId  // Check SMS status

import express from "express";

import { sendSmsRetry } from "../controller/smsController.ts";

const smsRouter = express.Router();

smsRouter.post("/retry/:entryId", sendSmsRetry);
// smsRouter.get("/status/:entryId", checkSmsStatus);

export default smsRouter;