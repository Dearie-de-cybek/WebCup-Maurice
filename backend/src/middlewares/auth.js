// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  // Skip auth for public routes
  if (req.path.startsWith("/public/")) {
    return next();
  }

  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Bearer token required" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = isAuthenticated;
