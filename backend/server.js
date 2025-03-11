const app = require("./index");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const { setSocketIo } = require("./middleware/notificationMiddleware");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

setSocketIo(io);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("register", (userId) => {
    console.log(`User registered: ${userId}`);
    socket.emit("Greeting", { message: `Welcome user ${userId}` });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
