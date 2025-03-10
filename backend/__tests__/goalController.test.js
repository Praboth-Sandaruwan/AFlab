const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Goal = require("../models/Goal");
const User = require("../models/User");
const { generateToken } = require("../middleware/generateToken");

let user, token;
let server;

beforeAll(async () => {
  server = app.listen(5003); // Use a different port for testing

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  user = new User({
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
    role: "admin",
  });

  await user.save();
  token = generateToken(user._id);
});

afterAll(async () => {
  await Goal.deleteMany();
  await User.deleteMany();
  await mongoose.connection.close();
  console.log("Mongoose connection closed");
  server.close(() => {
    console.log("Server closed");
  });
});

describe("Goals API", () => {
  let goalId;

  it("should create a new goal", async () => {
    const res = await request(app)
      .post("/api/goals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Save for a car",
        targetAmount: 5000,
        deadline: "2025-12-31",
        priority: 3,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");

    goalId = res.body._id; // Ensure goalId is set properly
    console.log("Created Goal ID:", goalId);
  });

  it("should get all user goals", async () => {
    const res = await request(app)
      .get("/api/goals")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update a goal", async () => {
    const goalCheck = await Goal.findById(goalId);
    console.log(goalId);
    console.log("Goal Found:", goalCheck);

    const res = await request(app)
      .put(`/api/goals/${goalId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ savedAmount: 1000, priority: 5, title: "Goal Title" });

    console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.savedAmount).toBe(1001);
  });

  it("should get goal progress", async () => {
    const res = await request(app)
      .get(`/api/goals/${goalId}/progress`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("progress");
  });

  it("should delete a goal", async () => {
    const res = await request(app)
      .delete(`/api/goals/${goalId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("should return 404 for non-existent goal", async () => {
    const res = await request(app)
      .get(`/api/goals/6060606060606060`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it("should return 400 for invalid priority", async () => {
    const res = await request(app)
      .post("/api/goals")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Save for a car",
        targetAmount: 5000,
        deadline: "2025-12-31",
        priority: 6,
      });
    expect(res.statusCode).toBe(400);
  });

  it("should return 401 for unauthorized access", async () => {
    const res = await request(app)
      .get("/api/goals")
      .set("Authorization", `Bearer ${token}1`);
    expect(res.statusCode).toBe(401);
  });
});
