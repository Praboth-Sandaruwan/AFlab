const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const { 
    setBudget, 
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    updateAnyBudget,
    deleteAnyBudget,
    getallbudgets,
    getAnyBudget,
} = require("../controllers/budgetController");
const router = express.Router();

//admin routes for Budget 

/**
 * @access admin
 * @desc get all budgets
 * @route GET /api/budgets/all
 * @returns array of {budget}
 */
router.get("/all", adminMiddleware, getallbudgets);

/**
 * @access admin
 * @desc update any budget
 * @route PUT /api/budgets/any/:id
 * @returns {budget}
 */
router.put("/any/:id", adminMiddleware, updateAnyBudget);

/**
 * @access admin
 * @desc delete any budget
 * @route DELETE /api/budgets/any/:id
 * @returns {budget}
 */
router.delete("/any/:id", adminMiddleware, deleteAnyBudget);

/**
 * @access admin
 * @desc get any budget
 * @route GET /api/budgets/any/:id
 * @returns {budget}
 */
router.get("/any/:id", adminMiddleware, getAnyBudget);

//user routes for Budget

/**
 * @access user
 * @desc create a budget
 * @route POST /api/budgets
 * @returns {budget}
 * @body {budget}
 */
router.post("/", authMiddleware, setBudget);

/**
 * @access user
 * @desc get all budgets
 * @route GET /api/budgets
 * @returns array of {budget}
 */
router.get("/", authMiddleware, getBudgets);

/**
 * @access user
 * @desc get budget by id
 * @route GET /api/budgets/:id
 * @returns {budget}
 */
router.get("/:id", authMiddleware, getBudgetById);

/**
 * @access user
 * @desc update a budget
 * @route PUT /api/budgets/:id
 * @returns {budget}
 */
router.put("/:id", authMiddleware, updateBudget);

/**
 * @access user
 * @desc delete a budget
 * @route DELETE /api/budgets/:id
 * @returns {budget}
 */
router.delete("/:id", authMiddleware, deleteBudget);


module.exports = router;
