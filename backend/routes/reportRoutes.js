const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { generateMonthlyReport } = require("../controllers/reportController");

const router = express.Router();

/**
 * @access user
 * @des generate monthly report
 * @route /api/report/monthly
 * @method GET
 * @returns report pdf
 */
router.get("/monthly", authMiddleware, generateMonthlyReport );

// http://localhost:5000/api/report/monthly?month=03&year=2025 + Bearer token
module.exports = router;
