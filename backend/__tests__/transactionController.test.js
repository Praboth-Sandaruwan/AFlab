const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const {
  generateToken,
  generateUserToken,
} = require("../middleware/generateToken");

let user, admin, userToken, adminToken;
let server;

beforeAll(async () => {
  server = app.listen(5014);

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  user = new User({
    name: "Test User",
    email: "user@example.com",
    password: "password123",
    role: "user",
  });
  await user.save();
  userToken = generateUserToken(user._id);

  admin = new User({
    name: "Test Admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  });
  await admin.save();
  adminToken = generateToken(admin._id);
});

afterAll(async () => {
  await User.deleteMany();
  await Transaction.deleteMany();
  await mongoose.connection.close();
  server.close();
});

describe("Transaction API", () => {
  let transactionId;

  it("should create a transaction", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        type: "expense",
        category: "Groceries",
        amount: 50,
        notes: "Weekly grocery shopping",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.type).toBe("expense");

    transactionId = res.body._id;
  });

  it("should get all transactions for the logged-in user", async () => {
    const res = await request(app)
      .get("/api/transactions")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get a specific transaction by ID", async () => {
    const res = await request(app)
      .get(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${userToken}`);
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(transactionId);
  });

  it("should update a transaction", async () => {
    const res = await request(app)
      .put(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        amount: 60,
        notes: "Updated grocery shopping",
        type: "expense",
        category: "Groceries",
      });

    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(60);
    expect(res.body.notes).toBe("Updated grocery shopping");
  });

  it("should delete a transaction", async () => {
    const res = await request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(204);
  });

  // Admin tests
  it("should allow admin to get all transactions", async () => {
    const res = await request(app)
      .get("/api/transactions/all")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should allow admin to get any transaction by ID", async () => {
    const newTransaction = new Transaction({
      userId: user._id,
      type: "income",
      category: "Salary",
      amount: 2000,
      notes: "Monthly salary",
      date: new Date(),
    });

    await newTransaction.save();

    const res = await request(app)
      .get(`/api/transactions/any/${newTransaction._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.category).toBe("Salary");
  });

  it("should allow admin to update any transaction", async () => {
    const newTransaction = new Transaction({
      userId: user._id,
      type: "expense",
      category: "Entertainment",
      amount: 100,
      notes: "Movie night",
      date: new Date(),
    });

    await newTransaction.save();

    const res = await request(app)
      .put(`/api/transactions/any/${newTransaction._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 150 });

    expect(res.statusCode).toBe(200);
    expect(res.body.amount).toBe(150);
  });

  it("should allow admin to delete any transaction", async () => {
    const newTransaction = new Transaction({
      userId: user._id,
      type: "expense",
      category: "Gaming",
      amount: 75,
      notes: "New game purchase",
      date: new Date(),
    });

    await newTransaction.save();

    const res = await request(app)
      .delete(`/api/transactions/any/${newTransaction._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });
});
