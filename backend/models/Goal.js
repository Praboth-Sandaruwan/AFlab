const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  priority: { type: Number, default: 1 },
  status: { type: String, enum: ["in-progress", "achieved", "expired"], default: "in-progress" },
});

module.exports = mongoose.model("Goal", GoalSchema);
