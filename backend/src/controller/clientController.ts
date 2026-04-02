import express from "express";
import User from "../model/User.ts";
import validators from "../utils/validators.ts";
import mongoose from "mongoose";


export const getAllClients = async(req: express.Request, res: express.Response) => {
    try {
        const clients = await User.find();

        return res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const getClientById = async(req: express.Request, res: express.Response) => {
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
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid id format" });
        }
        res.status(500).json({ message: "Server error", error });
    }
}

export const createClient = async(req: express.Request, res: express.Response) => {
    const { userName, phoneNumber, address, gstNumber, email, totalAmount, totalQuantity } = req.body;
    if (!userName) {
        return res.status(400).json({ message: "Username is required" });
    }
    if (email && !validators.validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }
    if (!validators.validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
    }
    if (gstNumber && !validators.validateGSTNumber(gstNumber)) {
        return res.status(400).json({ message: "Invalid GST number" });
    }
    try {
        const newClient = await User.create({
            username: userName,
            phoneNumber,
            address,
            gstNumber,
            email,
            totalAmount,
            totalQuantity
        });
        res.status(201).json({ message: "Client created successfully", data: newClient });
    } catch (error: any) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000 && error.keyValue) {
            // Find which field duplicated
            const fields = Object.keys(error.keyValue).join(', ');
            return res.status(409).json({
                message: "Conflict: duplicate field",
                details: `Duplicate value for: ${fields}`
            });
        }
        console.error("Error creating client:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const createClientBulk = async(req: express.Request, res: express.Response) => {
    const clients = req.body;
    if (!Array.isArray(clients) || clients.length === 0) {
        return res.status(400).json({ message: "Request body must be a non-empty array of clients" });
    }
    // Validate each client in the array
    for (const client of clients) {
        const { userName, phoneNumber, address, gstNumber, email, totalAmount, quantity } = client;
        if (!userName || !phoneNumber || !email || !gstNumber) {
            return res.status(400).json({ message: "Each client must have userName, phoneNumber, email, and gstNumber" });
        }
        if (email && !validators.validateEmail(email)) {
            return res.status(400).json({ message: `Invalid email for client ${userName}` });
        }
        if (phoneNumber && !validators.validatePhoneNumber(phoneNumber)) {
            return res.status(400).json({ message: `Invalid phone number for client ${userName}` });
        }
        if (gstNumber && !validators.validateGSTNumber(gstNumber)) {
            return res.status(400).json({ message: `Invalid GST number for client ${userName}` });
        }
    }
    try {
        const newClients = await User.insertMany(clients);
        res.status(201).json({ message: "Clients created successfully", data: newClients });
    } catch (error: any) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000 && error.keyValue) {
            const fields = Object.keys(error.keyValue).join(', ');
            return res.status(409).json({
                message: "Conflict: duplicate field",
                details: `Duplicate value for: ${fields}`
            });
        }
        res.status(500).json({ message: "Server error" });
    }
}

export const updateClient = async(req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { userName, phoneNumber, address, gstNumber, email, totalAmount } = req.body;
    if (!id) {
        return res.status(400).json({ message: "Client ID is required" });
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
    try {
        // Only update fields that are defined
        const updateData: any = {};
        if (userName !== undefined) updateData.username = userName;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        if (address !== undefined) updateData.address = address;
        if (gstNumber !== undefined) updateData.gstNumber = gstNumber;
        if (email !== undefined) updateData.email = email;
        if (totalAmount !== undefined) updateData.totalAmount = totalAmount;

        const updatedClient = await User.findByIdAndUpdate(id, updateData, { returnDocument: "after" });
        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.json({ message: "Client updated successfully", data: updatedClient });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error });
    }
}

export const deleteClient = async(req: express.Request, res: express.Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Client ID is required" });
    }
    try {
        const deletedClient = await User.findByIdAndDelete(id);
        if (!deletedClient) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.json({message:"Client deleted successfully"});
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error });
    }
}