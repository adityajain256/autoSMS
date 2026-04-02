import Entry from "../model/Entry.ts";
import User from "../model/User.ts";
import express from "express";


export const getAllEntries = async(req: express.Request, res: express.Response) => {
    try {
        const entries = await Entry.find().populate("userId");
        return res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


export const createEntry = async(req: express.Request, res: express.Response) => {
    const { userId, quantity, amount, message } = req.body;
    if (!userId || !quantity || !amount) {
        return res.status(400).json({ message: "userId, quantity and amount are required" });
    }
    try {
        const entry = await Entry.create({userId, quantity, amount, message});
        await User.findByIdAndUpdate(userId, { $inc: { totalAmount: amount, totalQuantity: quantity } }, { returnDocument: "after" });
        return res.status(201).json({data: entry, message: "Entry created successfully."});

    } catch (error) {
        res.status(500).json({ message: "Server error" });
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
        res.status(500).json({ message: "Server error" });
    }
}

export const updateDue = async(req: express.Request, res: express.Response) => {
    const { id } = req.params;
    if(!id){
        return res.status(400).json({message: "no id provided."})
    }
    try {
        const entry = await Entry.findById(id);
        if(!entry){
            return res.status(404).json({message: "Entry not found."});
        }
        if(!entry.isPaid){
            await User.findByIdAndUpdate(entry.userId, { $inc: { totalAmount: -entry.amount, totalQuantity: -entry.quantity } }, { returnDocument: "after" });
        }else{
            await User.findByIdAndUpdate(entry.userId, { $inc: { totalAmount: entry.amount, totalQuantity: entry.quantity } }, { returnDocument: "after" });
        }
        await Entry.findByIdAndUpdate(
            id,
            { isPaid: !entry.isPaid },
            { returnDocument: "after" }
        );
        return res.status(200).json({message: "Due updated successfully.", data: entry});
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}