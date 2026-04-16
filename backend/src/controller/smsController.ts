import express from "express";
import User from "../model/User.ts";
import mongoose from "mongoose";
import Admin from "../model/Auth.ts";
import { sendBulkDLTSMS } from "../config/fast2SMS.ts";
import SMS from "../model/Sms.ts";

export const sendSms = async (req: express.Request, res: express.Response) => {
  const { phoneNumber, message } = req.body;
  const session = await mongoose.default.startSession();
  session.startTransaction();
  try {
    const clients = await User.findOne({ phoneNumber: phoneNumber });
    if (!clients) {
      return res.status(404).json({ message: "Client not found" });
    }
    // const sms = await sendSMS(phoneNumber, message, (req as any).user.id);
    const sms = await sendBulkDLTSMS({
      numbers: [phoneNumber],
      templateId: message,
      senderId: process.env.FAST2SMS_SENDER_ID || "TXTIND",
      variables: [(req as any).user.id],
    });

    session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: "SMS sent to all clients", sms });
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
  
  interface Admin {
    _id: mongoose.Types.ObjectId;
    petrolPumpName: string;
    clients: {
      phoneNumber: string;
    }[];
  }
  const { eng, hindi } = req.body;
  try {
    let admin: Admin | null = null;

    admin = (await Admin.findById((req as any).user.id).populate(
      "clients",
    )) as any;
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const phoneNumbers = admin.clients.map((client) =>
      String(client.phoneNumber),
    );
    if (phoneNumbers.length === 0) {
      return res.status(404).json({ message: "No clients found." });
    }

    let failedClients: { phoneNumber: string; error: any }[] = [];
    const welcomeMessage = eng
      ? process.env.FAST2SMS_WELCOME_MESSAGE_ENG
      : process.env.FAST2SMS_MESSAGE_WELCOME_HINDI;

    await sendBulkDLTSMS({
      numbers: phoneNumbers,
      templateId: welcomeMessage || "Welcome back to our petrol pump",
      senderId: process.env.FAST2SMS_SENDER_ID || "TXTIND",
      variables: [admin.petrolPumpName],
    });

    await SMS.create(
      phoneNumbers.map((phone) => ({
        adminId: (req as any).user.id,
        to: "+91" + phone,
        body: welcomeMessage || "Welcome back to our petrol pump",
        status: "sent",
      })),
      { session: null },
    );

    if (failedClients.length === 0) {
      return res
        .status(200)
        .json({ message: "Welcome SMS sent to all clients" });
    } else {
      return res.status(207).json({
        message: "Some welcome SMS failed to send",
        failedClients,
      });
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
  const { eng, hindi } = req.body;
  interface user {
    phoneNumber: string;
    nonPaidAmount: number;
    date: Date;
    totalQuantity: number;
  }

  const session = await mongoose.default.startSession();
  session.startTransaction();

  try {
    const admin = (await Admin.findById((req as any).user.id).populate(
      "clients",
    )) as any;
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    const user = admin.clients.filter(
      (client: any) => client.nonPaidAmount > 0,
    );
    let respo: express.Response | null = null;
    const petrolPumpName = admin.petrolPumpName;
    const dueMessage = eng
      ? process.env.FAST2SMS_DUE_MESSAGE_ENG
      : process.env.FAST2SMS_DUE_MESSAGE_HINDI;

    for (const client of user) {
      const phone = String(client.phoneNumber);
      const dueAmount = String(client.nonPaidAmount.toFixed(2));
      const quantity = String(client.totalQuantity.toFixed(2));
      const date = client.updatedAt.toLocaleDateString("en-GB");
      try {
        await sendBulkDLTSMS({
          numbers: [phone],
          templateId: dueMessage || "",
          senderId: process.env.FAST2SMS_SENDER_ID || "TXTIND",
          variables: [dueAmount, quantity, date, petrolPumpName],
        });

        session.commitTransaction();
        respo = res
          .status(200)
          .json({ message: "Due SMS sent to all clients with dues" });
      } catch (error) {
        session.abortTransaction();
        session.endSession();
        respo = res.status(500).json({
          message: `Failed to send due SMS to ${phone}`,
          error,
        });
      }
    }
    return (
      respo || res.status(200).json({ message: "No clients with dues found" })
    );
  } catch (error) {
    return res
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
