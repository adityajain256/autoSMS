import Entry from "../model/Entry.ts";
import User from "../model/User.ts";
import express from "express";
import mongoose from "mongoose";

import excel from "exceljs";

import Admin from "../model/Auth.ts";

export const getAllEntries = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const entries = (await Entry.find().populate("userId")).toReversed();
    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const createEntry = async (
  req: express.Request,
  res: express.Response,
) => {
  const { quantity, amount, message, isPaid, type, date } = req.body;
  const rawClientId = req.params.clientId;

  if (Array.isArray(rawClientId) || rawClientId == null) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  const clientId = rawClientId;
  const parsedQuantity = Number(quantity).toFixed(2);
  const parsedAmount = Number(amount).toFixed(2);

  // Accept 0 as valid, only null/undefined is invalid
  if (
    !mongoose.Types.ObjectId.isValid(clientId) ||
    quantity == null ||
    amount == null ||
    !Number.isFinite(parsedQuantity) ||
    !Number.isFinite(parsedAmount)
  ) {
    return res.status(400).json({
      message:
        "Client ID, quantity and amount are required and must be valid numbers",
    });
  }

  const userObjectId = new mongoose.Types.ObjectId(clientId);

  const session = await mongoose.default.startSession();
  session.startTransaction();
  try {
    // Verify user exists inside transaction
    const petropumpName = String(
      await Admin.findById((req as any).user.id).select("petrolPumpName"),
    );
    const user = await User.findById(userObjectId, null, { session }).select(
      "phoneNumber paidAmount nonPaidAmount totalQuantity",
    );
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }
    const phone = String(user.phoneNumber);

    const entry: any = await Entry.create(
      [
        {
          userId: userObjectId,
          quantity: Number(parsedQuantity),
          amount: Number(parsedAmount),
          message,
          isPaid,
          type,
          date,
        },
      ],
      { session },
    );
    // const sms = await singleSMS(phone, message, [
    //   parsedAmount,
    //   parsedQuantity,
    //   date,
    //   petropumpName,
    // ]);
    // console.log("SMS Response:", sms);
    await User.findByIdAndUpdate(
      userObjectId,
      {
        $inc: {
          paidAmount: isPaid ? parsedAmount : 0.0,
          nonPaidAmount: isPaid ? 0.0 : parsedAmount,
          totalQuantity: parsedQuantity,
        },
        $push: { entries: entry[0]._id },
      },
      { session },
    );
    await session.commitTransaction();
    session.endSession();
    return res
      .status(201)
      .json({ data: entry[0], message: "Entry created successfully." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error creating entry:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getEntryByClientId = async (
  req: express.Request,
  res: express.Response,
) => {
  const { clientId } = req.params;
  if (!clientId) {
    return res.status(400).json({ message: "Client ID is required" });
  }
  try {
    const user = await User.findById(clientId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const entries = (await Entry.find({ userId: clientId })).toReversed();
    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateDue = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "no id provided." });
  }
  const session = await mongoose.default.startSession();
  session.startTransaction();
  try {
    const entry = await Entry.findByIdAndUpdate(
      id,
      {
        isPaid: !Entry.isPaid,
      },
      { session },
    );
    if (!entry) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Entry not found." });
    }
    const user = await User.findById(entry.userId, null, { session });
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found." });
    }
    // Compute increment/decrement based on isPaid
    let userUpdate;
    if (entry.isPaid) {
      if (user.paidAmount > entry.amount) {
        userUpdate = {
          $inc: {
            paidAmount: -entry.amount.toFixed(2),
            nonPaidAmount: entry.amount.toFixed(2),
          },
        };
      } else {
        userUpdate = {
          $inc: {
            paidAmount: -user.paidAmount.toFixed(2),
            nonPaidAmount: user.paidAmount.toFixed(2),
          },
        };
      }
    } else {
      if (user.nonPaidAmount > entry.amount) {
        userUpdate = {
          $inc: {
            paidAmount: entry.amount.toFixed(2),
            nonPaidAmount: -entry.amount.toFixed(2),
          },
        };
      } else {
        userUpdate = {
          $inc: {
            paidAmount: entry.amount.toFixed(2),
            nonPaidAmount: -user.nonPaidAmount.toFixed(2),
          },
        };
      }
      await User.findByIdAndUpdate(entry.userId, userUpdate, { session });

      const updatedEntry = await Entry.findByIdAndUpdate(
        id,
        { isPaid: !entry.isPaid },
        { session, returnDocument: "after" },
      );
      await session.commitTransaction();
      session.endSession();
      return res
        .status(200)
        .json({ message: "Due updated successfully.", data: updatedEntry });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: "Server error" });
  }
};

export const exportClientEntriesToExcel = async (
  req: express.Request,
  res: express.Response,
) => {
  const { clientId } = req.params;
  if (!clientId) {
    return res.status(400).json({ message: "Client ID is required" });
  }
  try {
    const entries = await Entry.find({ userId: clientId }).populate("userId");
    const user = entries[0]?.userId as any;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Entries");

    worksheet.name = `${user.name}'s Entries`;
    worksheet.columns = [
      {
        header: "Date",
        key: "date",
        width: 20,
        style: { numFmt: "mm/dd/yyyy" },
      },
      { header: "Type", key: "type", width: 20 },
      { header: "Quantity", key: "quantity", width: 15 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Message", key: "message", width: 30 },
      { header: "Is Paid", key: "isPaid", width: 10 },
    ];
    worksheet.addRows(
      entries.map((entry) => {
        return {
          date: entry.date.toLocaleDateString(),
          type: entry.type,
          quantity: entry.quantity,
          amount: entry.amount,
          message: entry.message,
          isPaid: entry.isPaid ? "Yes" : "No",
        };
      }),
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=entries_${user.name}_${Date.now()}.xlsx`,
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
