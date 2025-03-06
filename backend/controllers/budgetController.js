const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

exports.setBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    const budget = new Budget({ userId: req.user.id, category, limit, month });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
