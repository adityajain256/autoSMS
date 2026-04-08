import mongoose from "mongoose";

const smsSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    to: { type: String, required: true },
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    errorMessage: { type: String, default: "" },
  },
  { timestamps: true },
);

const SMS = mongoose.model("SMS", smsSchema);

export default SMS;
