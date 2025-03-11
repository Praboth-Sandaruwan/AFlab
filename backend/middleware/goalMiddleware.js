const Goal = require("../models/Goal");
const {
  goalReachedNotification,
} = require("../middleware/notificationMiddleware");

const updateFinancialGoals = async (userId, incomeAmount) => {
  const goals = await Goal.find({ userId, status: "in-progress" }).sort({
    priority: -1,
  });

  if (!goals.length) return;

  let remainingIncome = incomeAmount;

  if (incomeAmount <= 0) {
    return;
  }
  const totalPriority = goals.reduce((sum, goal) => sum + goal.priority, 0);

  for (const goal of goals) {
    if (remainingIncome <= 0) break;

    const allocation = (goal.priority / totalPriority) * incomeAmount;
    const amountToSave = Math.min(
      allocation,
      goal.targetAmount - goal.savedAmount
    );

    goal.savedAmount += amountToSave;

    if (goal.savedAmount >= goal.targetAmount) {
      goal.status = "achieved";
      await goalReachedNotification(userId, goal.title);
    }

    remainingIncome -= amountToSave;
    await goal.save();
  }
};

module.exports = { updateFinancialGoals };
