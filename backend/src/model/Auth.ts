import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    adminName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "staff"], required: true },
    password: { type: String, required: true },
    // PII: address field, do not log, encrypt at rest in future
    address: {
      type: String /* TODO: encrypt at rest, add access controls, retention policy */,
    },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    petrolPumpName: { type: String },
    smsCount: { type: Number, default: 0 },
    englishWelcomeSMS: { type: String, default: "" },
    hindiWelcomeSMS: { type: String, default: "" },
  },
  { timestamps: true },
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
