const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { generateMonthlyReport } = require("../controllers/reportController");

const router = express.Router();
router.get("/monthly", authMiddleware, generateMonthlyReport );

module.exports = router;
