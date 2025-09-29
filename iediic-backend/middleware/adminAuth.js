const jwt = require("jsonwebtoken");

// Protect routes middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store admin info in req.user
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Optional: check superadmin role
const verifySuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin")
    return res.status(403).json({ message: "Access denied" });
  next();
};

module.exports = { protect, verifySuperAdmin };
