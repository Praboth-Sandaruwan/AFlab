const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const swaggerDocument = YAML.load("./swagger.yaml");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const currencyController = require("./controllers/currencyController");
const reportRoute = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const notificationController = require("./controllers/notificationController");
const goalroutes = require("./routes/goalRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(express.json());

notificationController.setSocketIo(io);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/currencyEx", currencyController.getExchangeRate);
app.use("/api/report", reportRoute);
app.use("/api/notifications", notificationRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalroutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});