const express = require("express");
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  deleteTransaction,
  updateTransaction,
  addTags,
  removeTagByName,
  deleteAnyTransaction,
  updateAnyTransaction,
  getallTransactions,
  getAnyTransactionById,
} = require("../controllers/transactionController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

const router = express.Router();

// user routes for transactions

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getTransactions);
router.get("/:id", authMiddleware, getTransactionById);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);
router.put("/:id/tags", authMiddleware, addTags);
router.delete("/:id/tags", authMiddleware, removeTagByName);


// admin routes for transactions

router.get("/all",adminMiddleware, getallTransactions);
router.get("/any/:id",adminMiddleware, getAnyTransactionById);
router.put("/any/:id",adminMiddleware, updateAnyTransaction);
router.delete("/any/:id",adminMiddleware, deleteAnyTransaction);

module.exports = router;
