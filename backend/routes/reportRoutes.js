const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { generateMonthlyReport } = require("../controllers/reportController");

const router = express.Router();
router.get("/monthly", authMiddleware, generateMonthlyReport );

// http://localhost:5000/api/report/monthly?month=03&year=2025 + Bearer token
module.exports = router;
