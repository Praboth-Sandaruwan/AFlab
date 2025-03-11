const Budget = require("../models/Budget");
const {
  budgetExceededNotification,
} = require("../middleware/notificationMiddleware");

const updateBudget = async (
  userId,
  category,
  amountDifference,
  transactionDate
) => {
  const budget = await Budget.findOne({
    userId,
    category,
    month: `${transactionDate.toLocaleString("default", {
      month: "long",
    })}-${transactionDate.getFullYear()}`,
  });

  if (budget) {
    budget.spent += amountDifference;
    await budget.save();

    if (budget.spent > budget.limit) {
      console.log("Warning: Budget exceeded for", budget.category);
      budgetExceededNotification(budget.userId, budget.category);
    }
  }
};

module.exports = { updateBudget };
