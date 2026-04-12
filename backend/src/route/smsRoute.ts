// SMS Management
// POST   /api/sms/retry/:entryId   // Retry failed SMS
// GET    /api/sms/status/:entryId  // Check SMS status

import express from "express";
import {
  sendWelcomeSMS,
  sendDueSMS,
  sendSmsToAll,
} from "../controller/smsController.ts";
import authMiddleware from "../middleware/auth.middleware.ts";
const smsRouter = express.Router();

smsRouter.use(authMiddleware);

smsRouter.post("/sendSMS", sendSmsToAll);

/**
 * @swagger
 * /api/sms/send/welcomeSMS:
 *   post:
 *     summary: Send welcome SMS to all clients who haven't received it yet.
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eng:
 *                 type: boolean
 *                 description: English welcome message.
 *               hindi:
 *                 type: boolean
 *                 description: Hindi welcome message.
 *     responses:
 *       200:
 *         description: SMS sent to all clients successfully.
 *       404:
 *         description: Admin not found.
 *       500:
 *         description: Error sending SMS to all clients.
 */
smsRouter.post("/send/welcomeSMS", sendWelcomeSMS);
smsRouter.post("/send/dueSMS", sendDueSMS);
// smsRouter.post("/send/monthlySms", sendMonthlySMS);
// smsRouter.get("/status/:entryId", checkSmsStatus);

export default smsRouter;
