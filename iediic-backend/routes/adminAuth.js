const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const router = express.Router();
const { protect } = require("../middleware/adminAuth");


// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid username" });

    const match = await admin.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, role: admin.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", protect, async (req, res) => {
  const user = await Admin.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
