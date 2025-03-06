const express = require("express");
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
  updateTransaction,
  addTags,
  removeTagByName
} = require("../controllers/transactionController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getTransactions);
router.get("/:id", authMiddleware, getTransactionById);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);
router.put("/:id/tags", authMiddleware, addTags);
router.delete("/:id/tags", authMiddleware, removeTagByName);

module.exports = router;
