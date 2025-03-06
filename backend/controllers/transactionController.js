const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { type, category, amount, notes } = req.body;

    const transaction = new Transaction({
      userId: req.user.id,
      type,
      category,
      amount,
      notes,
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
