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
          console.log(`User ${userId} disconnected with socket id ${socket.id}`);
          break;
        }
      }
    });
  });
};

module.exports = { setSocketIo, userSocketMap, getIo: () => io };
