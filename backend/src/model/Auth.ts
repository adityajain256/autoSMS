import mongoose from "mongoose";


const adminSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    adminName: { type: String, required: true},
    phoneNumber: { type: String, required: true, unique: true},
    role: { type: String, enum: ['admin', 'staff'], required: true },
    password: { type: String, required: true },
    // PII: address field, do not log, encrypt at rest in future
    address: { type: String, /* TODO: encrypt at rest, add access controls, retention policy */ }

}, {timestamps: true});

// Hash password before saving if new or modified
import bcrypt from "bcryptjs";
adminSchema.pre('save', async function (this: any) {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;