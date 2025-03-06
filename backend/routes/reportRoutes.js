const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getMonthlyReport } = require("../controllers/reportController");

const router = express.Router();
router.get("/monthly", authMiddleware, getMonthlyReport);

module.exports = router;
