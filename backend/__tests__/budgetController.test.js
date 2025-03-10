const request = require("supertest");
const app = require("../index"); 
const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2VjMDlkMjVmZGE3YmJiODYyYjg0ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MTYwNDU2MywiZXhwIjoxNzQxNjA4MTYzfQ.KrcFrvsJ7x6plbTXLbujxKmBtnlUf6LGjGY4K4QYfQI"; // Example token

jest.mock("../models/Budget");
jest.mock("../models/Transaction");

console.log("Test file is loaded");

describe("Budget Controller", () => {
  let server;

  beforeAll(() => {
    server = app.listen(5001); 
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  describe("POST /api/budgets", () => {
    it("should create a new budget", async () => {
      const budgetData = {
        category: "Food",
        limit: 500,
        month: "March-2025",
      };


      Budget.prototype.save = jest.fn().mockResolvedValue(budgetData);

      const response = await request(server)
        .post("/api/budgets")
        .set("Authorization", token)
        .send(budgetData);

      console.log("POST /api/budgets response: ", response.body); 

      expect(response.status).toBe(201);
    });

    describe("GET /api/budgets", () => {
      it("should fetch all budgets for the user", async () => {
        const budgets = [
          { category: "Food", limit: 500, month: "March-2025" },
          { category: "Transportation", limit: 200, month: "March-2025" },
        ];


        Budget.find = jest.fn().mockResolvedValue(budgets);

        const response = await request(server)
          .get("/api/budgets")
          .set("Authorization", token);

        console.log("GET /api/budgets response: ", response.body); 

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].category).toBe("Food");
      });

      it("should return an error if fetching budgets fails", async () => {
        const error = new Error("Database error");
        Budget.find = jest.fn().mockRejectedValue(error);

        const response = await request(server)
          .get("/api/budgets")
          .set("Authorization", token);

        console.log("GET /api/budgets error: ", response.body); 

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Database error");
      });
    });

    describe("PUT /api/budgets/:id", () => {
      it("should update a budget", async () => {
        const updatedBudget = {
          category: "Entertainment",
          limit: 300,
          month: "March-2025",
        };

        Budget.findOneAndUpdate = jest.fn().mockResolvedValue(updatedBudget);

        const response = await request(server)
          .put("/api/budgets/1")
          .set("Authorization", token)
          .send(updatedBudget);

        console.log("PUT /api/budgets/:id response: ", response.body); 

        expect(response.status).toBe(200);
        expect(response.body.category).toBe("Entertainment");
        expect(response.body.limit).toBe(300);
      });

      it("should return an error if updating the budget fails", async () => {
        const error = new Error("Budget not found");
        Budget.findOneAndUpdate = jest.fn().mockRejectedValue(error);

        const response = await request(server)
          .put("/api/budgets/1")
          .set("Authorization", token)
          .send({
            category: "Entertainment",
            limit: 300,
            month: "March-2025",
          });

        console.log("PUT /api/budgets/:id error: ", response.body);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Budget not found");
      });
    });

    describe("DELETE /api/budgets/:id", () => {
      it("should delete a budget", async () => {
        const budget = {
          _id: "1",
          category: "Food",
          limit: 500,
          month: "March-2025",
        };

        Budget.findOneAndDelete = jest.fn().mockResolvedValue(budget);

        const response = await request(server)
          .delete("/api/budgets/1")
          .set("Authorization", token);

        console.log("DELETE /api/budgets/:id response: ", response.body);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe("1");
      });

      it("should return an error if deleting the budget fails", async () => {
        const error = new Error("Budget not found");
        Budget.findOneAndDelete = jest.fn().mockRejectedValue(error);

        const response = await request(server)
          .delete("/api/budgets/1")
          .set("Authorization", token);

        console.log("DELETE /api/budgets/:id error: ", response.body); 

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Budget not found");
      });
    });

    describe("Admin Routes", () => {
      it("should fetch all budgets as an admin", async () => {
        const adminBudget = {
          category: "Food",
          limit: 500,
          month: "March-2025",
        };

        Budget.find = jest.fn().mockResolvedValue([adminBudget]);

        const response = await request(server)
          .get("/api/budgets/all") 
          .set("Authorization", token);

        console.log("Admin GET /api/budgets/all response: ", response.body); 

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].category).toBe("Food");
      });
    });
  });
});
