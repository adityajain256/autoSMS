// SMS Management
// POST   /api/sms/retry/:entryId   // Retry failed SMS
// GET    /api/sms/status/:entryId  // Check SMS status

import express from "express";
import {
  sendWelcomeSMS,
  sendDueSMS,
  sendSmsToAll,
} from "../controller/smsController.ts";

const smsRouter = express.Router();

smsRouter.post("/sendSMS", sendSmsToAll);
smsRouter.post("/send/welcomeSMS", sendWelcomeSMS);
smsRouter.post("/send/dueSMS", sendDueSMS);
// smsRouter.post("/send/monthlySms", sendMonthlySMS);
// smsRouter.get("/status/:entryId", checkSmsStatus);

export default smsRouter;
