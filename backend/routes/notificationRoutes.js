const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {adminMiddleware} = require("../middleware/adminMiddleware");
const {
  createNotification,
  getNotifications,
  markAsRead,
  deleteAllNotifications,
  deleteNotification,
} = require("../controllers/notificationController");


const router = express.Router();

router.post("/", adminMiddleware, createNotification);
router.get("/", authMiddleware, getNotifications);
router.delete("/", authMiddleware, deleteAllNotifications);
router.put("/:id", authMiddleware, markAsRead);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;