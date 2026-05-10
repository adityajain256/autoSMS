import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    adminName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
      type: String,
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    petrolPumpName: { type: String },
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    resetToken: { type: String, expires: "1h" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
