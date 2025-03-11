const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  recurring: {
    type: {
      isRecurring: { type: Boolean, default: false},
      period: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
      },
      isPaidNow: { type: Boolean, default: false },
    },
    default: {},
  },
  notes: { type: String },
  tags: [{ type: String }],
});

module.exports = mongoose.model("Transaction", TransactionSchema);
