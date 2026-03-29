import mongoose from "mongoose";
import { time } from "node:console";

const adminSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    adminName: { type: String, required: true},
    phoneNumber: { type: String, required: true, unique: true},
    role: { type: String, enum: ['admin', 'staff'], required: true },
    password: { type: String, required: true }

}, {timestamps: true});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;