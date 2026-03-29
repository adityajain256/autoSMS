import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    adminName: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;