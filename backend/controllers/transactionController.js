const Transaction = require("../models/Transaction");
const { updateFinancialGoals } = require("../middleware/goalMiddleware");
const { updateBudget } = require("../middleware/budgetMiddleware");


exports.createTransaction = async (req, res) => {
  try {
    const { type, category, amount, notes } = req.body;

    const transaction = new Transaction({
      userId: req.user.id,
      type,
      category,
      amount,
      notes,
      date: new Date(),
    });

    await transaction.save();

    if (type === "expense") {
      await updateBudget(req.user.id, category, amount, transaction.date);
    } else if (type === "income") {
      await updateFinancialGoals(transaction.userId, transaction.amount);
    }

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

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const { type, category, amount, notes, date } = req.body;
    const prvAmnt = transaction.amount;

    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.amount = amount ?? transaction.amount;
    transaction.notes = notes || transaction.notes;
    transaction.date = date || transaction.date;

    if (
      transaction.type !== type &&
      prvAmnt !== 0 &&
      transaction.category !== category
    ) {
      return res.status(400).json({
        message:
          "Cannot change transaction type/category after creation unless your previous expenses are 0",
      });
    }

    await transaction.save();

    const amountDifference = amount - prvAmnt;

    console.log(transaction);

    if (transaction.type === "expense") {
      await updateBudget(
        transaction.userId,
        transaction.category,
        amountDifference,
        transaction.date
      );
    } else if (transaction.type === "income") {
      await updateFinancialGoals(req.user.id, amountDifference);
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await transaction.deleteOne();

    const amountDifference = 0 - transaction.amount;

    if (transaction.type === "expense") {
      updateBudget(
        transaction.userId,
        transaction.category,
        amountDifference,
        transaction.date
      );
    } else if (transaction.type === "income") {
      updateFinancialGoals(transaction.userId, amountDifference);
    }

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addTags = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: "Tags must be an array." });
    }

    transaction.tags = tags;

    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeTagByName = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: "Tags must be an array." });
    }

    transaction.tags = transaction.tags.filter((tag) => !tags.includes(tag));

    await transaction.save();

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getallTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnyTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAnyTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    await transaction.deleteOne();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAnyTransaction = async (req, res) => {
  let prvAmnt;
  let uid;
  let categor;
  let transactionDate;

  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    prvAmnt = transaction.amount;
    uid = transaction.userId;
    categor = transaction.category;
    transactionDate = transaction.date;

    const { type, category, amount, notes, date } = req.body;

    const amountDifference = amount - prvAmnt;

    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.amount = amount ?? transaction.amount;
    transaction.notes = notes || transaction.notes;
    transaction.date = date || transaction.date;

    await transaction.save();

    await updateBudget(uid, categor, amountDifference, transactionDate);

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
