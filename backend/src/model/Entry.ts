import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      validate: {
        validator: (v: number) => /^\d+(\.\d{1,3})?$/.test(String(v)),
        message:
          "Quantity must be a positive number with up to 3 decimal places.",
      },
    },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: (v: number) => /^\d+(\.\d{1,3})?$/.test(String(v)),
        message:
          "Amount must be a positive number with up to 3 decimal places.",
      },
    },
    isPaid: { type: Boolean, default: false },
    message: { type: String, default: "" },
    type: {
      type: String,
      enum: ["petrol", "diesel", "CNG"],
      required: true,
      default: "diesel",
    },
    date: { type: Date, max: Date.now, default: Date.now },
  },
  { timestamps: true },
);

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;
