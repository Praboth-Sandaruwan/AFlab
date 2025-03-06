const Transaction = require("../models/Transaction");

exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(`${year}-${month}-31`);

    const transactions = await Transaction.find({ 
      userId: req.user.id, 
      date: { $gte: startDate, $lte: endDate }
    });

    const totalIncome = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);

    res.json({ totalIncome, totalExpense, transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
