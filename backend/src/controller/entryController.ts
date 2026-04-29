import Entry from "../model/Entry.js";
import User from "../model/User.js";
import Client from "../model/Client.js";
import express from "express";
import mongoose from "mongoose";

import excel from "exceljs";
import redisClient from "../config/redis.js";
import logger from "../utils/logger.js";
import { getAllEntriesService } from "../service/entryService.js";

export const getAllEntries = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const entries = await getAllEntriesService(String((req as any).user.id));
    if (!entries.success) {
      logger.warn(`No entries found for user with id: ${(req as any).user.id}`);
      return res.status(404).json({ message: "No entries found" });
    }
    return res.status(200).json(entries.data);
  } catch (error) {
    logger.error(`Error in getAllEntries: ${error}`);
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

  const ClientObjectId = new mongoose.Types.ObjectId(clientId);

  const session = await mongoose.default.startSession();
  session.startTransaction();
  try {
    // Verify Client exists inside transaction
    const petropumpName = String(
      await redisClient.get(`user:${(req as any).user.id}:petrolPumpName`),
    );
    const client = await Client.findById(ClientObjectId, null, {
      session,
    }).select("phoneNumber paidAmount nonPaidAmount totalQuantity");
    if (!client) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Client not found" });
    }
    const phone = String(client.phoneNumber);

    const entry = new Entry({
      userId: String(ClientObjectId),
      quantity: Number(parsedQuantity.toFixed(2)),
      amount: Number(parsedAmount.toFixed(2)),
      message,
      isPaid,
      type,
      date,
    });
    const savedEntry = await entry.save({ session });
    // const sms = await singleSMS(phone, message, [
    //   parsedAmount,
    //   parsedQuantity,
    //   date,
    //   petropumpName,
    // ]);
    // console.log("SMS Response:", sms);
    await Client.findByIdAndUpdate(
      ClientObjectId,
      {
        $inc: {
          paidAmount: isPaid ? Number(parsedAmount.toFixed(2)) : 0.0,
          nonPaidAmount: isPaid ? 0.0 : Number(parsedAmount.toFixed(2)),
          totalQuantity: Number(parsedQuantity.toFixed(2)),
        },
        $push: { entries: savedEntry._id },
      },
      { session },
    );
    await session.commitTransaction();
    session.endSession();
    return res
      .status(201)
      .json({ data: savedEntry, message: "Entry created successfully." });
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
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
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
    const entry = await Entry.findById(id, { session });
    if (!entry) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Entry not found." });
    }
    entry.isPaid = !entry.isPaid;
    await entry?.save();
    const client = await Client.findById(entry.userId, null, { session });
    if (!client) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Client not found." });
    }
    // Compute increment/decrement based on isPaid
    let ClientUpdate;
    if (entry.isPaid) {
      if (client.paidAmount > entry.amount) {
        ClientUpdate = {
          $inc: {
            paidAmount: -entry.amount.toFixed(2),
            nonPaidAmount: entry.amount.toFixed(2),
          },
        };
      } else {
        ClientUpdate = {
          $inc: {
            paidAmount: -client.paidAmount.toFixed(2),
            nonPaidAmount: client.paidAmount.toFixed(2),
          },
        };
      }
    } else {
      if (client.nonPaidAmount > entry.amount) {
        ClientUpdate = {
          $inc: {
            paidAmount: entry.amount.toFixed(2),
            nonPaidAmount: -entry.amount.toFixed(2),
          },
        };
      } else {
        ClientUpdate = {
          $inc: {
            paidAmount: entry.amount.toFixed(2),
            nonPaidAmount: -client.nonPaidAmount.toFixed(2),
          },
        };
      }
      await Client.findByIdAndUpdate(entry.userId, ClientUpdate, { session });

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
    const client = entries[0]?.userId as any;
    if (!client) {
      logger.error(`Client with ID ${clientId} not found for entries export.`);
      return res.status(404).json({ message: "Client not found" });
    }

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Entries");

    worksheet.name = `${client.name}'s Entries`;
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
      `attachment; filename=entries_${client.name}_${Date.now()}.xlsx`,
    );
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
