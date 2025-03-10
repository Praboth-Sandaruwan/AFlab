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

/**
 * @access admin
 * @des create a notification
 * @route /api/notifications
 * @method POST
 */
router.post("/", adminMiddleware, createNotification);

/**
 * @access user
 * @des get all notifications
 * @route /api/notifications
 * @method GET
 * @returns array of {notifications}
 */
router.get("/", authMiddleware, getNotifications);

/**
 * @access user
 * @des mark all notifications as read
 * @route /api/notifications
 * @method DELETE
 */
router.delete("/", authMiddleware, deleteAllNotifications);

/**
 * @access user
 * @des mark a notification as read
 * @route /api/notifications/:id
 * @method PUT
 */
router.put("/:id", authMiddleware, markAsRead);

/**
 * @access user
 * @des delete a notification
 * @route /api/notifications/:id
 * @method DELETE
 */
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;