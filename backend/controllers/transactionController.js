const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

const currentDate = new Date();
const currentMonth = currentDate.toLocaleString("default", {
  month: "long",
});
const currentYear = currentDate.getFullYear();
const currentMonthYear = `${currentMonth}-${currentYear}`;

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

    const budget = await Budget.findOne({
      userId: req.user.id,
      category,
      month: currentMonthYear,
    });

    if (budget) {
      budget.spent += amount;
      await budget.save();

      if (budget.spent > budget.limit) {
        console.log("Warning: Budget exceeded for", budget.category);
      }
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

    await transaction.save();

    const amountDifference = amount - prvAmnt;

    const budget = await Budget.findOne({
      userId: req.user.id,
      category,
      month: `${transaction.date.toLocaleString("default", {
        month: "long",
      })}-${transaction.date.getFullYear()}`,
    });

    if (budget) {
      budget.spent += amountDifference;
      await budget.save();

      if (budget.spent > budget.limit) {
        console.log("Warning: Budget exceeded for", budget.category);
      }
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

    const { category } = transaction;

    await transaction.deleteOne();

    const budget = await Budget.findOne({
      userId: req.user.id,
      category,
      month: `${transaction.date.toLocaleString("default", {
        month: "long",
      })}-${transaction.date.getFullYear()}`,
    });

    if (budget) {
      budget.spent -= transaction.amount;
      await budget.save();

      if (budget.spent > budget.limit) {
        console.log("Warning: Budget exceeded for", budget.category);
      }
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

    const tagName = req.body.tagName;
    transaction.tags = transaction.tags.filter((tag) => tag !== tagName);

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
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    const { type, category, amount, notes, date } = req.body;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.amount = amount ?? transaction.amount;
    transaction.notes = notes || transaction.notes;
    transaction.date = date || transaction.date;
    await transaction.save();
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
