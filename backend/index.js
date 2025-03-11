const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = YAML.load("./swagger.yaml");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const currencyController = require("./controllers/currencyController");
const reportRoute = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const goalroutes = require("./routes/goalRoutes");

const app = express();

dotenv.config();

connectDB();

app.use(express.json());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/currencyEx", currencyController.getExchangeRate);
app.use("/api/report", reportRoute);
app.use("/api/notifications", notificationRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalroutes);


module.exports = app;