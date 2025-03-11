const Goal = require("../models/Goal");
const {
  goalReachedNotification,
  goalExpiredNotification,
} = require("../middleware/notificationMiddleware");

exports.createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, priority, savedAmount } = req.body;

    if (priority && (priority < 1 || priority > 5)) {
      return res
        .status(400)
        .json({ message: "Priority must be between 1 and 5" });
    }

    const goal = new Goal({
      userId: req.user.id,
      title,
      targetAmount,
      savedAmount: savedAmount || 1,
      deadline,
      priority: priority || 1,
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id })
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { savedAmount, priority, targetAmount, deadline, title, status } =
      req.body;
    const goal = await Goal.findById(req.params.id);

    goal.priority = goal.priority || priority;
    goal.targetAmount = goal.targetAmount || targetAmount;
    goal.deadline = goal.deadline || deadline;
    goal.title = goal.title || title;
    goal.status = goal.status || status;

    // if (!goal || goal.userId !== req.user.id) {
    //   return res.status(404).json({ message: "Goal not found" });         // commented for testing purposes
    // }
    if(title) goal.title = title;
    
    if (targetAmount) goal.targetAmount = targetAmount;

    if (savedAmount) goal.savedAmount += savedAmount;

    if (priority) {
      if (priority < 1 || priority > 5) {
        return res
          .status(400)
          .json({ message: "Priority must be between 1 and 5" });
      }
      goal.priority = priority;
    }

    if (goal.savedAmount >= goal.targetAmount) {
      goal.status = "achieved";
      goalReachedNotification(goal.userId, goal.title);
    }

    if (new Date(goal.deadline) < new Date() && goal.status !== "achieved") {
      goal.status = "expired";
      goalExpiredNotification(goal.userId, goal.title);
    }

    await goal.save();
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal || goal.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Goal not found" });
    }

    await goal.deleteOne();
    res.status(200).json({ message: "Goal deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGoalProgress = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal || goal.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Goal not found" });
    }

    const progress = ((goal.savedAmount / goal.targetAmount) * 100).toFixed(2);

    res.status(200).json({ progress: `${progress}%`, goal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAnyGoal = async (req, res) => {
  try {
    const { savedAmount, priority, targetAmount, deadline, title, status } =
      req.body;
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    goal.priority = goal.priority || priority;
    goal.targetAmount = goal.targetAmount || targetAmount;
    goal.deadline = goal.deadline || deadline;
    goal.title = goal.title || title;
    goal.status = goal.status || status;
    goal.savedAmount = goal.savedAmount || savedAmount;

    await goal.save();

    res.status(200).json(goal);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAnyGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
        }
    
        await goal.deleteOne();
        res.status(200).json({ message: "Goal deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
