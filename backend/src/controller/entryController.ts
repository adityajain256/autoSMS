import Entry from "../model/Entry.ts";
import User from "../model/User.ts";
import express from "express";
import mongoose from "mongoose";
import { sendSMS } from "../config/teilio.ts";

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
  const parsedQuantity = Number(quantity);
  const parsedAmount = Number(amount);

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

    const user = await User.findById(userObjectId, null, { session });
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    const entry: any = await Entry.create(
      [
        {
          userId: userObjectId,
          quantity: parsedQuantity,
          amount: parsedAmount,
          message,
          isPaid,
          type,
          date,
        },
      ],
      { session },
    );
    const smsRes = await sendSMS(
      user.phoneNumber,
      `New entry created: Quantity ${parsedQuantity}, Amount ${parsedAmount}. Message: ${message}`,
    );
    console.log("SMS response:", smsRes);
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
    console.error("Error fetching entries:", error);
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
            paidAmount: -entry.amount,
            nonPaidAmount: entry.amount,
          },
        };
      } else {
        userUpdate = {
          $inc: {
            paidAmount: -user.paidAmount,
            nonPaidAmount: user.paidAmount,
          },
        };
      }
    } else {
      if (user.nonPaidAmount > entry.amount) {
        userUpdate = {
          $inc: {
            paidAmount: entry.amount,
            nonPaidAmount: -entry.amount,
          },
        };
      } else {
        userUpdate = {
          $inc: {
            paidAmount: entry.amount,
            nonPaidAmount: -user.nonPaidAmount,
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
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
