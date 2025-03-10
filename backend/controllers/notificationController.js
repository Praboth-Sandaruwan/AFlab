const Notification = require("../models/Notification");

let io;
const userSocketMap = new Map();

exports.setSocketIo = (socketIoInstance) => {
  io = socketIoInstance;

  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} registered with socket id ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (let [key, value] of userSocketMap.entries()) {
        if (value === socket.id) {
          userSocketMap.delete(key);
          break;
        }
      }
    });
  });
};

exports.createNotification = async (req, res) => {
  const { userId, message } = req.body;

  try {
    if (typeof message !== "string") {
      console.error("Invalid message type:", typeof message);
      return res.status(400).json({ error: "Message must be a string" });
    }

    // console.log("Notification message:", message);

    const notification = new Notification({ userId, message });
    await notification.save();

    const socketId = userSocketMap.get(userId);
    if (socketId) {
      io.to(socketId).emit("notification", notification);
    }

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      notification.read = true;
      await notification.save();
      res.status(200).json(notification);
    } else {
      res.status(404).json({ error: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating notification" });
  }
};
