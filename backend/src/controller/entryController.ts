import Entry from "../model/Entry.ts";
import User from "../model/User.ts";
import express from "express";
import mongoose from "mongoose";


export const getAllEntries = async(req: express.Request, res: express.Response) => {
    try {
        const entries = await Entry.find().populate("userId");
        return res.status(200).json(entries);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}


export const createEntry = async(req: express.Request, res: express.Response) => {
    const { userId, quantity, amount, message } = req.body;
    // Accept 0 as valid, only null/undefined is invalid
    if (userId == null || quantity == null || amount == null || !Number.isFinite(Number(quantity)) || !Number.isFinite(Number(amount))) {
        return res.status(400).json({ message: "userId, quantity and amount are required and must be numbers" });
    }
    const session = await mongoose.default.startSession();
    session.startTransaction();
    try {
        // Verify user exists inside transaction
        const user = await User.findById(userId, null, { session });
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "User not found" });
        }
        const entry = await Entry.create([{ userId, quantity, amount, message }], { session });
        await User.findByIdAndUpdate(userId, { $inc: { totalAmount: amount, totalQuantity: quantity } }, { session });
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({ data: entry[0], message: "Entry created successfully." });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Server error" });
    }
}

export const getEntryByClientId = async(req: express.Request, res: express.Response) => {
    const { clientId } = req.params;
    if (!clientId) {
        return res.status(400).json({ message: "Client ID is required" });
    }
    try {
        const entries = await Entry.find({ userId: clientId });
        return res.status(200).json(entries);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

export const updateDue = async(req: express.Request, res: express.Response) => {
    const { id } = req.params;
    if(!id){
        return res.status(400).json({message: "no id provided."})
    }
    const session = await mongoose.default.startSession();
    session.startTransaction();
    try {
        const entry = await Entry.findById(id, null, { session });
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
        if (!entry.isPaid) {
            userUpdate = { $inc: { totalAmount: -entry.amount, totalQuantity: -entry.quantity } };
        } else {
            userUpdate = { $inc: { totalAmount: entry.amount, totalQuantity: entry.quantity } };
        }
        await User.findByIdAndUpdate(entry.userId, userUpdate, { session });
        const updatedEntry = await Entry.findByIdAndUpdate(
            id,
            { isPaid: !entry.isPaid },
            { session, returnDocument: "after" }
        );
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({ message: "Due updated successfully.", data: updatedEntry });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Server error" });
    }
}