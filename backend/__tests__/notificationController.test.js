const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { generateToken } = require("../middleware/generateToken");

let user, token;
let server;

beforeAll(async () => {
    
  server = app.listen(5010);
   
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

afterAll(async () => {
  await Notification.deleteMany();
  await User.deleteMany();
  await mongoose.connection.close();
  server.close();
});

describe("Notification API", () => {
  let notificationId;

  it("should create a new notification", async () => {
    const res = await request(app)
      .post("/api/notifications")
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: user._id, message: "Hello test message" });

    expect(res.statusCode).toBe(201);
    expect(res.body.notification).toHaveProperty("_id");
    notificationId = res.body.notification._id;
  });

  it("should fetch all notifications", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should update a notification", async () => {
    const res = await request(app)
      .put(`/api/notifications/${notificationId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ read: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.read).toBe(true);
  });

  it("should delete a notification", async () => {
    const res = await request(app)
      .delete(`/api/notifications/${notificationId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Notification deleted");
  });

  it("should delete all notifications", async () => {
    const res = await request(app)
      .delete("/api/notifications")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Notifications cleared");
  });

  it("should return 500 on invalid notification update", async () => {
    const res = await request(app)
      .put("/api/notifications/6060606060606060")
      .set("Authorization", `Bearer ${token}`)
      .send({ read: true });

    expect(res.statusCode).toBe(500);
  });

  it("should return 401 for unauthorized access", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${token}1`);

    expect(res.statusCode).toBe(401);
  });
});
