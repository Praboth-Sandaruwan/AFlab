const Notification = require("../models/Notification");

const userSocketMap = new Map();
let io = null;

const setSocketIo = (socketIoInstance) => {
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
          console.log(
            `User ${userId} disconnected with socket id ${socket.id}`
          );
          break;
        }
      }
    });
  });
};

const budgetExceededNotification = async (userId, category) => {
  try {
    const message = `You have exceeded the budget for ${category}`;
    const notification = new Notification({ userId, message });
    await notification.save();
    console.log("Notification created:", notification);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

const goalReachedNotification = async (userId, title) => {
  try {
    const message = `You have acheived the completion of ${title} financial goal`;
    const notification = new Notification({ userId, message });
    await notification.save();
    console.log("Notification created:", notification);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

const goalExpiredNotification = async (userId, title) => {
  try {
    const message = `The deadline for ${title} financial goal has expired`;
    const notification = new Notification({ userId, message });
    await notification.save();
    console.log("Notification created:", notification);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

module.exports = {
  setSocketIo,
  userSocketMap,
  getIo: () => io,
  goalReachedNotification,
  goalExpiredNotification,
  budgetExceededNotification,
};
