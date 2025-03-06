const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { setBudget, getBudgets } = require("../controllers/budgetController");

const router = express.Router();

router.post("/", authMiddleware, setBudget);
router.get("/", authMiddleware, getBudgets);

module.exports = router;
