const jwt = require("jsonwebtoken");

exports.adminMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.status(401).json({ message: "Access Denied" });

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (decoded.role !== "admin") {
        res.status(401).json({ message: "Access Denied Not an admin" });
    }
    
    next();

  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
    console.error("Error in JWT Middleware:", error);
  }
};
