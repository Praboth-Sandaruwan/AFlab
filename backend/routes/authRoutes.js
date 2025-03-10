const express = require("express");
const {
  register,
  login,
  loginAdmin,
  registerAdmin,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
  getAnyUserById,
  updateAnyUser,
  deleteAnyUser,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

const router = express.Router();


/**
 * @access admin
 * @route GET /api/auth/all
 * @returns {object} - users
*/
router.get("/all", adminMiddleware, getAllUsers);

/**
 * @access admin
 * @route GET /api/auth/any/:id
 * @returns {object} - user
 * @param {string} id - user's id
*/
router.get("/any/:id", adminMiddleware, getAnyUserById);

/**
 * @access admin
 * @route PUT /api/auth/any/:id
 * @returns {object} - message
 * @param {string} id - user's id
*/
router.put("/any/:id", adminMiddleware, updateAnyUser);

/**
 * @access admin
 * @route DELETE /api/auth/any/:id
 * @returns {object} - message
 * @param {string} id - user's id
 */
router.delete("/any/:id", adminMiddleware, deleteAnyUser);

/**
 * @access user
 * @param {string} name - user's name
 * @param {string} email - user's email
 * @param {string} password - user's password
 * @route POST /api/auth/register
 * @returns {object} - message
 */
router.post("/register", register);

/**
 * @access user
 * @param {string} email - user's email
 * @route POST /api/auth/login
 * @returns {object} - token
 */
router.post("/login", login);

/**
 * @access user/admin
 * @route GET /api/auth/:id
 * @returns {object} - user/admin profile
 */
router.get("/:id", authMiddleware, getUserById);

/**
 * @access user/admin
 * @route PUT /api/auth/:id
 * @returns {object} - message
 * @param {string} id - user's id
 */
router.put("/:id", authMiddleware, updateUser);

/**
 * @access user/admin
 * @route DELETE /api/auth/:id
 * @returns {object} - message
 * @param {string} id - user's id
 */
router.delete("/:id", authMiddleware, deleteUser);

/**
 * @access admin
 * @param {string} name - user's name
 * @param {string} email - user's email
 * @param {string} password - user's password
 * @route POST /api/auth/register/admin
 * @returns {object} - message
 */
router.post("/register/admin", registerAdmin);

/**
 * @access admin
 * @param {string} email - user's email
 * @route POST /api/auth/login/admin
 * @returns {object} - token
 */
router.post("/login/admin", loginAdmin);



module.exports = router;
