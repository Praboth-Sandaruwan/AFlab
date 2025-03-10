const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  getGoalProgress
} = require("../controllers/goalController");

const router = express.Router();

/**
 * @route   POST /api/goals
 * @desc    Create a new financial goal
 * @access  user
 */
router.post("/", authMiddleware, createGoal);

/**
 * @route   GET /api/goals
 * @desc    Get all financial goals for the authenticated user (sorted by priority)
 * @access  user
 */
router.get("/", authMiddleware, getGoals);

/**
 * @route   PUT /api/goals/:id
 * @desc    Update a financial goal (saved amount, priority, status)
 * @access  user
 */
router.put("/:id", authMiddleware, updateGoal);

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete a financial goal
 * @access  user
 */
router.delete("/:id", authMiddleware, deleteGoal);

/**
 * @route   GET /api/goals/:id/progress
 * @desc    Get progress of a specific financial goal
 * @access  user
 */
router.get("/:id/progress", authMiddleware, getGoalProgress);

module.exports = router;
