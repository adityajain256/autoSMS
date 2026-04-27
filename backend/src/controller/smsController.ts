import express from "express";
import mongoose from "mongoose";
import SMS from "../model/Sms.ts";
import User from "../model/User.ts";
import logger from "../utils/logger.ts";
import Client from "../model/Client.ts";
import {
  sendDueSMSService,
  sendWelcomeSMSService,
} from "../service/smsService.ts";

export const sendWelcomeSMS = async (
  req: express.Request,
  res: express.Response,
) => {
  const { eng, hindi } = req.body;
  const authId = (req as any).user.id;
  try {
    const result = await sendWelcomeSMSService(authId, eng ? "eng" : "hin");
    if (!result?.success) {
      return res
        .status(501)
        .json({ message: result?.message || "Failed to send welcome SMS" });
    }
    return res.status(200).json({ message: "Welcome SMS sent to all clients" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error sending welcome SMS to all clients", error });
  }
};

export const sendDueSMS = async (
  req: express.Request,
  res: express.Response,
) => {
  const { eng, hindi } = req.body;
  const authId = (req as any).user.id;

  try {
    const result = await sendDueSMSService(authId, eng ? "eng" : "hin");
    if (!result?.success) {
      return res
        .status(501)
        .json({ message: result?.message || "Failed to send due SMS" });
    }
    return res
      .status(200)
      .json({ message: "Due SMS sent to all clients with dues" });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to send due SMS to all clients with dues`,
      error,
    });
  }
};
// export const sendMonthlySMS = async (
//   req: express.Request,
//   res: express.Response,
// ) => {
//   try {
//     const entries = await Entry.find().populate("userId");
//     const monthlyData: Record<
//       string,
//       { totalAmount: number; totalQuantity: number }
//     > = {};

//     entries.forEach((entry) => {
//       const month = entry.date.toLocaleString("default", { month: "long" });
//       if (!monthlyData[month]) {
//         monthlyData[month] = { totalAmount: 0, totalQuantity: 0 };
//       }
//       monthlyData[month].totalAmount += entry.amount;
//       monthlyData[month].totalQuantity += entry.quantity;
//     });

//     for (const month in monthlyData) {
//       try {
//         await sendSMS(
//           (entries[0].userId as any).phoneNumber,
//           `Monthly Summary for ${month}:\nTotal Amount: ${monthlyData[month].totalAmount}\nTotal Quantity: ${monthlyData[month].totalQuantity}`,
//         );
//         res
//           .status(200)
//           .json({ message: "Monthly summary SMS sent to all clients" });
//       } catch (error) {
//         res.status(500).json({
//           message: `Failed to send monthly summary SMS for ${month}`,
//           error,
//         });
//       }
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         message: "Error sending monthly summary SMS to all clients",
//         error,
//       });
//   }
// };
