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

// Admin routes

/**
 * @access admin
 * @des get all transactions
 * @route /api/transactions/all
 * @method GET
 * @returns array of {transactions}
 */
router.get("/all", adminMiddleware, getallTransactions);

/**
 * @access admin
 * @des get any transaction by id
 * @route /api/transactions/any/:id
 * @method GET
 * @param id
 * @returns {transaction}
 */
router.get("/any/:id", adminMiddleware, getAnyTransactionById);

/**
 * @access admin
 * @des update any transaction by id
 * @route /api/transactions/any/:id
 * @method PUT
 * @param id
 * @returns {transaction}
 */
router.put("/any/:id", adminMiddleware, updateAnyTransaction);

/**
 * @access admin
 * @des delete any transaction by id
 * @route /api/transactions/any/:id
 * @param id
 * @method DELETE
 */
router.delete("/any/:id", adminMiddleware, deleteAnyTransaction);

// User routes 

/**
 * @access user
 * @des create a transaction
 * @route /api/transactions
 * @method POST
 */
router.post("/", authMiddleware, createTransaction);

/**
 * @access user
 * @des get all transactions
 * @route /api/transactions
 * @method GET
 * @returns array of {transactions}
 */
router.get("/", authMiddleware, getTransactions);

/**
 * @access user
 * @des get a transaction by id
 * @route /api/transactions/:id
 * @method GET
 * @param id
 * @returns {transaction}
 */
router.get("/:id", authMiddleware, getTransactionById);

/**
 * @access user
 * @des update a transaction by id
 * @route /api/transactions/:id
 * @method PUT
 * @param id
 * @returns {transaction}
 */
router.put("/:id", authMiddleware, updateTransaction);

/**
 * @access user
 * @des delete a transaction by id
 * @route /api/transactions/:id
 * @method DELETE
 * @param id
 */
router.delete("/:id", authMiddleware, deleteTransaction);

/**
 * @access user
 * @des add tags to a transaction
 * @route /api/transactions/:id/tags
 * @method PUT
 * @param id
 */
router.put("/:id/tags", authMiddleware, addTags);

/**
 * @access user
 * @des remove a tag from a transaction
 * @route /api/transactions/:id/tags
 * @method DELETE
 * @param id
 */
router.delete("/:id/tags", authMiddleware, removeTagByName);

module.exports = router;
