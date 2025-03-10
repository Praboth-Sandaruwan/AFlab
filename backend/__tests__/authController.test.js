const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
jest.mock("../models/User");

const mockToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2VjMDlkMjVmZGE3YmJiODYyYjg0ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MTYwNDU2MywiZXhwIjoxNzQxNjA4MTYzfQ.KrcFrvsJ7x6plbTXLbujxKmBtnlUf6LGjGY4K4QYfQI";

describe("Auth Controller", () => {
  let server;

  beforeAll(() => {
    server = app.listen(5030);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue(userData);

      const response = await request(server).post("/api/auth/register").send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
    });

    it("should return 400 if user already exists", async () => {
      User.findOne = jest.fn().mockResolvedValue({ email: "test@example.com" });

      const response = await request(server).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login a user and return a token", async () => {
      const user = {
        _id: "1",
        email: "test@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "user",
      };

      User.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const response = await request(server).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it("should return 400 for invalid credentials", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(server).post("/api/auth/login").send({
        email: "invalid@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});
