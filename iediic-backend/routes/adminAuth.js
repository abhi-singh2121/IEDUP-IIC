const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const router = express.Router();
const { protect } = require("../middleware/adminAuth");


// Admin Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
   console.log("🟡 Login Attempt:", username, password); 

  try {
    const admin = await Admin.findOne({ username });
    console.log("🟢 Found admin:", admin);
    if (!admin) return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
     console.log("🔵 Password match result:", isMatch);
    if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token, role: admin.role, name: admin.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/me", protect, async (req, res) => {
  const user = await Admin.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
