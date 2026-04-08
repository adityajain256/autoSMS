import express from "express";
import { sendSMS } from "../config/teilio.ts";
import Entry from "../model/Entry.ts";
import User from "../model/User.ts";
import mongoose from "mongoose";
import Admin from "../model/Auth.ts";

export const sendSmsToAll = async (
  req: express.Request,
  res: express.Response,
) => {
  const { message } = req.body;
  const session = await mongoose.default.startSession();
  session.startTransaction();
  try {
    const clients = await User.find({ welcomeSMSSent: false }).select(
      "phoneNumber",
    );
    for (const client of clients) {
      try {
        await sendSMS(client.phoneNumber, message);
        client.welcomeSMSSent = true;
        await client.save();
      } catch (error) {
        return res.status(500).json({
          message: `Failed to send SMS to ${client.phoneNumber}`,
          error,
        });
      }
    }
    session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: "SMS sent to all clients" });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ message: "Error sending SMS to all clients", error });
  }
};

export const sendWelcomeSMS = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const admin = await Admin.findById((req as any).user.id).select(
      "englishWelcomeSMS hindiWelcomeSMS petrolPumpName",
    );
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    const clients = await User.find({ welcomeSMSSent: false }).select(
      "phoneNumber",
    );
    for (const client of clients) {
      try {
        await sendSMS(
          client.phoneNumber,
          admin.englishWelcomeSMS +
            "\n" +
            admin.petrolPumpName +
            "\n" +
            admin.hindiWelcomeSMS +
            "\n" +
            admin.petrolPumpName,
        );
        return res
          .status(200)
          .json({ message: "Welcome SMS sent to all clients" });
      } catch (error) {
        return res.status(500).json({
          message: `Failed to send welcome SMS to ${client.phoneNumber}`,
          error,
        });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending welcome SMS to all clients", error });
  }
};

export const sendDueSMS = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const dueEntries = await Entry.find({ isPaid: false }).populate("userId");
    for (const entry of dueEntries) {
      try {
        await sendSMS(
          (entry.userId as any).phoneNumber,
          `Dear customer, you have an outstanding due of ${entry.amount} for your purchase on ${entry.date.toDateString()}. Please make the payment at your earliest convenience. Thank you!`,
        );
        res
          .status(200)
          .json({ message: "Due SMS sent to all clients with dues" });
      } catch (error) {
        res.status(500).json({
          message: `Failed to send due SMS to ${(entry.userId as any).phoneNumber}`,
          error,
        });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending due SMS to all clients", error });
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
