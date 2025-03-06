const Notification = require("../models/Notification");

exports.createNotification = async (userId, message) => {
  const notification = new Notification({ userId, message });
  await notification.save();
};

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id });
  res.status(200).json(notifications);
};
