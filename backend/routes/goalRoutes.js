const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  getGoalProgress,
  getAllGoals,
  updateAnyGoal,
  deleteAnyGoal,
} = require("../controllers/goalController");
const { adminMiddleware } = require("../middleware/adminMiddleware");

const router = express.Router();

/**
 * @route   GET /api/goals/all
 * @desc    Get all financial goals for the authenticated user (sorted by priority)
 * @access  admin
 */
router.get("/all", adminMiddleware, getAllGoals);

/**
 * @route   PUT /api/goals/any/:id
 * @desc    Update a financial goal (saved amount, priority, status)
 * @access  admin
 */
router.put("/any/:id", adminMiddleware, updateAnyGoal);

/**
 * @route   DELETE /api/goals/any/:id
 * @desc    Delete a financial goal
 * @access  admin
 */
router.delete("/any/:id", adminMiddleware, deleteAnyGoal);

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
