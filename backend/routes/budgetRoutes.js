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
router.get("/all", adminMiddleware, getallbudgets);
router.put("/any/:id", adminMiddleware, updateAnyBudget);
router.delete("/any/:id", adminMiddleware, deleteAnyBudget);
router.get("/any/:id", adminMiddleware, getAnyBudget);

//user routes for Budget
router.post("/", authMiddleware, setBudget);
router.get("/", authMiddleware, getBudgets);
router.get("/:id", authMiddleware, getBudgetById);
router.put("/:id", authMiddleware, updateBudget);
router.delete("/:id", authMiddleware, deleteBudget);


module.exports = router;
