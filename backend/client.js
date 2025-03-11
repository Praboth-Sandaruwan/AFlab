const io = require("socket.io-client");

const socket = io("http://localhost:5000", { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
  socket.emit("register", "67c9298a4b7912adf99d8672");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

socket.on("notification", (notification) => {
  console.log("Received Notification:", notification.message);
});
