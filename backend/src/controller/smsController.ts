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
  interface Admin {
    _id: mongoose.Types.ObjectId;
    englishWelcomeSMS: string;
    hindiWelcomeSMS: string;
    petrolPumpName: string;
  }
  const { eng, hindi } = req.body;
  try {
    let admin: Admin | null = null;

    admin = await Admin.findById((req as any).user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const clients = await User.find({
      authId: (req as any).user.id,
      welcomeSMSSent: false,
    }).select("phoneNumber");
    console.log("Clients to send welcome SMS:", clients);
    let welcomeMessage = eng
      ? admin.englishWelcomeSMS + "\n" + admin.petrolPumpName
      : admin.hindiWelcomeSMS + "\n" + admin.petrolPumpName;
    let failedClients: { phoneNumber: string; error: any }[] = [];
    for (const client of clients) {
      let phn = String(client.phoneNumber);
      try {
        await sendSMS(phn, welcomeMessage);
      } catch (error) {
        failedClients.push({ phoneNumber: phn, error });
      }
    }
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
    console.error("Error sending welcome SMS to all clients:", error);
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
  try {
    const user = await User.find({ nonPaidAmount: { $gt: 0 } });
    let respo: express.Response | null = null;
    const petrolPumpName = (await Admin.findById((req as any).user.id))
      ?.petrolPumpName;
    for (const client of user) {
      const phone = String(client.phoneNumber);
      try {
        await sendSMS(
          phone,
          eng
            ? `Dear customer, you have an outstanding due of ${client.nonPaidAmount} for your purchase. Please make the payment at your earliest convenience. Thank you! -${petrolPumpName}`
            : `प्रिय ग्राहक, आपकी खरीदारी के लिए ${new Date().toDateString()} को ₹${client.nonPaidAmount} का बकाया है। कृपया जल्द से जल्द भुगतान करें। धन्यवाद! -${petrolPumpName}`,
        );
        respo = res
          .status(200)
          .json({ message: "Due SMS sent to all clients with dues" });
      } catch (error) {
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
