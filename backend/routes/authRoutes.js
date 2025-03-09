const express = require("express");
const { register, login, loginAdmin, registerAdmin } = require("../controllers/authController");

const router = express.Router();

//user routes

router.post("/register", register);
router.post("/login", login);

//admin routes

router.post("/register/admin", registerAdmin);
router.post("/login/admin", loginAdmin);


module.exports = router;
