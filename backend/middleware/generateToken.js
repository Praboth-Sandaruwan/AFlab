const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId, role:"admin" }, process.env.JWT_SECRET, {
    expiresIn: "1h", 
  });
};

const generateUserToken = (userId) => {
  return jwt.sign({ id: userId, role:"user" }, process.env.JWT_SECRET, {
    expiresIn: "1h", 
  });
};

module.exports = { generateToken, generateUserToken };
