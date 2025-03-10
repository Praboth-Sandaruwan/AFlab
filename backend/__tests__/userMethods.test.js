const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const User = require("../models/User");
const { generateToken } = require("../middleware/generateToken");

let user, adminToken, userToken;
let server;

beforeAll(async () => {
  server = app.listen(5013);

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  user = await User.create({
    name: "Test Admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  });

  const normalUser = await User.create({
    name: "Test User",
    email: "user@example.com",
    password: "password123",
    role: "user",
  });

  adminToken = generateToken(user._id);
  userToken = generateToken(normalUser._id);
});

afterAll(async () => {
  await User.deleteMany();
  await mongoose.connection.close();
  server.close();
});

describe("Auth API methods other than login and register", () => {
  it("should return a list of all users (Admin only)", async () => {
    const res = await request(app)
      .get("/api/auth/all")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("users");
    expect(Array.isArray(res.body.users)).toBeTruthy();
  });

  it("should get a user by ID", async () => {
    const res = await request(app)
      .get(`/api/auth/${user._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", user.name);
  });

  it("should update user details", async () => {
    const updateData = { name: "Updated User" };

    const res = await request(app)
      .put(`/api/auth/${user._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Updated User");
  });

  it("should reset the updated fields", async () => {
    const updateData = { name: "Test Admin" };

    const res = await request(app)
      .put(`/api/auth/${user._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updateData);

    console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", "Test Admin");
  });

  it("should delete a user", async () => {
    const newUser = await User.create({
      name: "To Be Deleted",
      email: "delete@example.com",
      password: "password123",
    });

    const res = await request(app)
      .delete(`/api/auth/${newUser._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });

  it("should get any user by admin", async () => {
    const res = await request(app)
      .get(`/api/auth/any/${user._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    console.log(res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("name", user.name);
  });

  it("should update any user by admin", async () => {
    const updateData = { role: "admin" };

    const res = await request(app)
      .put(`/api/auth/any/${user._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("role", "admin");
  });

  it("should delete any user by admin", async () => {
    const newUser = await User.create({
      name: "Admin Delete",
      email: "admindelete@example.com",
      password: "password123",
    });

    const res = await request(app)
      .delete(`/api/auth/any/${newUser._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(204);
  });
});
