import express from "express";
import User from "../model/User.ts";
import validators from "../utils/validators.ts";
import mongoose from "mongoose";
import Admin from "../model/Auth.ts";
import Entry from "../model/Entry.ts";

export const getAllClients = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const clients = await User.find({ authId: (req as any).user.id }).populate(
      "entries",
    );

    return res.status(200).json(clients);
  } catch (error) {
    console.log("Error fetching clients:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClientById = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Client ID is required" });
  }
  try {
    const client = await User.findById({ _id: id }).populate("entries");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error: any) {
    // If error is CastError, return 400
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid id format" });
    }
    console.error("Error fetching client by id:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createClient = async (
  req: express.Request,
  res: express.Response,
) => {
  const {
    userName,
    phoneNumber,
    address,
    gstNumber,
    email,
    paidAmount,
    nonPaidAmount,
    totalQuantity,
    vehicle,
  } = req.body;
  if (!userName) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (email && !validators.validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (phoneNumber && !validators.validatePhoneNumber(phoneNumber)) {
    return res.status(400).json({ message: "Invalid phone number" });
  }
  if (gstNumber && !validators.validateGSTNumber(gstNumber)) {
    return res.status(400).json({ message: "Invalid GST number" });
  }
  const authId = (req as any).user.id;
  if (!authId) {
    return res.status(400).json({ message: "no credentials." });
  }
  const p = `${phoneNumber}`;
  try {
    const newClient = await User.create({
      username: userName,
      phoneNumber: p,
      address,
      gstNumber,
      email,
      paidAmount,
      nonPaidAmount,
      totalQuantity,
      authId: authId,
      vehicle,
    });
    await Admin.findByIdAndUpdate(authId, {
      $push: { clients: newClient._id },
    });
    res
      .status(201)
      .json({ message: "Client created successfully", data: newClient });
  } catch (error: any) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000 && error.keyValue) {
      // Find which field duplicated
      const fields = Object.keys(error.keyValue).join(", ");
      console.error("Duplicate field error:", error);
      return res.status(409).json({
        message: "Conflict: duplicate field",
        details: `Duplicate value for: ${fields}`,
      });
    }
    console.error("Error creating client:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createClientBulk = async (
  req: express.Request,
  res: express.Response,
) => {
  const clients = req.body;
  if (!Array.isArray(clients) || clients.length === 0) {
    return res
      .status(400)
      .json({ message: "Request body must be a non-empty array of clients" });
  }
  // Validate and map each client in the array
  const mappedClients = [];
  for (const client of clients) {
    const {
      userName,
      phoneNumber,
      address,
      gstNumber,
      email,
      totalAmount,
      totalQuantity,
    } = client;
    if (!userName) {
      return res
        .status(400)
        .json({ message: "Each client must have userName" });
    }
    if (email && !validators.validateEmail(email)) {
      return res
        .status(400)
        .json({ message: `Invalid email for client ${userName}` });
    }
    if (phoneNumber && !validators.validatePhoneNumber(phoneNumber)) {
      return res
        .status(400)
        .json({ message: `Invalid phone number for client ${userName}` });
    }
    if (gstNumber && !validators.validateGSTNumber(gstNumber)) {
      return res
        .status(400)
        .json({ message: `Invalid GST number for client ${userName}` });
    }
    mappedClients.push({
      username: userName,
      phoneNumber,
      address,
      gstNumber,
      email,
      totalAmount,
      totalQuantity,
    });
  }
  try {
    const newClients = await User.insertMany(mappedClients);
    res
      .status(201)
      .json({ message: "Clients created successfully", data: newClients });
  } catch (error: any) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000 && error.keyValue) {
      const fields = Object.keys(error.keyValue).join(", ");
      return res.status(409).json({
        message: "Conflict: duplicate field",
        details: `Duplicate value for: ${fields}`,
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateClient = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  const { amount } = req.body;
  const session = await mongoose.default.startSession();
  session.startTransaction();

  try {
    // Only update fields that are defined\

    const client = await User.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (amount > client.nonPaidAmount) {
      return res.status(400).json({
        message: "Amount cannot be greater than non-paid amount / due amount",
      });
    }
    await Entry.create({
      userId: id,
      amount: amount,
      type: "Payment",
      quantity: 0,
      date: new Date(),
      isPaid: true,
    });
    client.paidAmount += amount;
    client.nonPaidAmount -= amount;
    await client.save();

    session.commitTransaction();
    session.endSession();

    res.json({ message: "Client updated successfully", data: client });
  } catch (error: any) {
    session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteClient = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  const session = await mongoose.default.startSession();
  session.startTransaction();
  try {
    await Entry.deleteMany({ userId: id }, { session });
    const deletedClient = await User.findByIdAndDelete(id);
    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }
    await session.commitTransaction();
    session.endSession();
    res.json({ message: "Client deleted successfully" });
  } catch (error: any) {
    session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error", error });
  }
};
