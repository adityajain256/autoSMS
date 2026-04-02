import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    username: { type: String, required: true, unique: true },
    email: {
        type: String,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^(\+91[\-\s]?)?[6-9]\d{9}$/, "Please use a valid phone number."],
    },
    gstNumber: {
        type: String,
        default: null,
        match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Please use a valid GST number."],
    },
    // PII: address field, do not log, encrypt at rest in future, restrict access, add retention/deletion/audit
    address: { type: String, /* TODO: encrypt at rest, restrict access, add retention/deletion, audit access */ },
    totalAmount: { type: Number, default: 0},
    totalQuantity: { type: Number, default: 0},

    entries: {type: [mongoose.Schema.Types.ObjectId], ref: "Entry" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;