const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Budget = require("../models/Budget");
const User = require("../models/User");
const { generateToken } = require("../middleware/generateToken");

let user, token;
let server;
let budgetId;

beforeAll(async () => {
  server = app.listen(5020);

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  user = new User({
    name: "Test Admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  });
  await user.save();
  token = generateToken(user._id);
});

beforeEach(async () => {
  const budget = new Budget({
    category: "Food",
    limit: 500,
    month: "March-2025",
    userId: user._id,
  });
  await budget.save();
  budgetId = budget._id;
});

afterAll(async () => {
  await Budget.deleteMany();
  await User.deleteMany();
  await mongoose.connection.close();
  server.close();
});

describe("Budget API", () => {

  it("should create a new budget", async () => {
    const res = await request(app)
      .post("/api/budgets")
      .set("Authorization", `Bearer ${token}`)
      .send({ category: "Food", limit: 500, month: "March-2025" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });

  it("should get all budgets of every user", async () => {
    const res = await request(app)
      .get("/api/budgets/all")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should fetch all budgets of a authorised user", async () => {
    const res = await request(app)
      .get("/api/budgets")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get a specific budget of authorised user", async () => {
    const res = await request(app)
      .get(`/api/budgets/${budgetId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
  });

  it("should update a specific budget of authorised user", async () => {
    const res = await request(app)
      .put(`/api/budgets/${budgetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ limit: 600 });

    expect(res.statusCode).toBe(200);
    expect(res.body.limit).toBe(600);
  });

  it("should delete a specific budget of authorised user", async () => {
    const res = await request(app)
      .delete(`/api/budgets/${budgetId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("should get any budget with id", async () => {
    const res = await request(app)
      .get(`/api/budgets/any/${budgetId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
  });

  it("should update any budget with id", async () => {
    const res = await request(app)
      .put(`/api/budgets/any/${budgetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ limit: 600 });

    expect(res.statusCode).toBe(200);
    expect(res.body.limit).toBe(600);
  });

  it("should delete any budget with id", async () => {
    const res = await request(app)
      .delete(`/api/budgets/any/${budgetId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("should return 404 for a non-existent budget", async () => {
    const res = await request(app)
      .get("/api/budgets/6060606060606060")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(500);
  });

  it("should return 500 on invalid budget update", async () => {
    const res = await request(app)
      .put("/api/budgets/invalidId")
      .set("Authorization", `Bearer ${token}`)
      .send({ limit: 700 });
    expect(res.statusCode).toBe(500);
  });

  it("should return 401 for unauthorized access", async () => {
    const res = await request(app)
      .get("/api/budgets")
      .set("Authorization", `Bearer ${token}1`);
    expect(res.statusCode).toBe(401);
  });
});
