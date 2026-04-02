import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    message: { type: String, default: "" },
    date: {type: Date, max: Date.now, default: Date.now}
}, { timestamps: true });

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;