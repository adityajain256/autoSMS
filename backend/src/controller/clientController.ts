import express from "express";
import User from "../model/User.ts";
import validators from "../utils/validators.ts";


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
    // Validate ObjectId format
    const mongoose = require('mongoose');
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid id format" });
    }
    try {
        const client = await User.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.json(client);
    } catch (error: any) {
        // If error is CastError, return 400
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid id format" });
        }
        res.status(500).json({ message: "Server error" });
    }
}

export const createClient = async(req: express.Request, res: express.Response) => {
    const { userName, phoneNumber, address, gstNumber, email, totalAmount } = req.body;
    if (!userName || !phoneNumber || !address || !gstNumber || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!validators.validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }
    if (!validators.validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
    }
    if (!validators.validateGSTNumber(gstNumber)) {
        return res.status(400).json({ message: "Invalid GST number" });
    }
    try {
        const newClient = await User.create({
            username: userName,
            phoneNumber,
            address,
            gstNumber,
            email,
            totalAmount
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

        const updatedClient = await User.findByIdAndUpdate(id, updateData, { new: true });
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