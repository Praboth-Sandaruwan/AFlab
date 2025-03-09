const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { 
    setBudget, 
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
} = require("../controllers/budgetController");

const router = express.Router();

router.post("/", authMiddleware, setBudget);
router.get("/", authMiddleware, getBudgets);
router.get("/:id", authMiddleware, getBudgetById);
router.put("/:id", authMiddleware, updateBudget);
router.delete("/:id", authMiddleware, deleteBudget);

module.exports = router;
