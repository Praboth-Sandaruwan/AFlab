const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {adminMiddleware} = require("../middleware/adminMiddleware");
const {
  createNotification,
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");


const router = express.Router();

router.post("/", adminMiddleware, createNotification);
router.get("/", authMiddleware, getNotifications);
router.put("/:id", authMiddleware, markAsRead);

module.exports = router;