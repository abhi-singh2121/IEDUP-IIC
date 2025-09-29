const express = require("express");
const router = express.Router();
const { protect, verifySuperAdmin } = require("../middleware/adminAuth");
const Incubation = require("../models/Incubation");
const PreIncubation = require("../models/PreIncubation");
const Contact = require("../models/Contact");

// Get counts for dashboard
router.get("/stats", protect, async (req, res) => {
  try {
    const incubationCount = await Incubation.countDocuments();
    const preIncubationCount = await PreIncubation.countDocuments();
    const contactCount = await Contact.countDocuments();

    res.json({ incubationCount, preIncubationCount, contactCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get recent submissions
router.get("/recent-incubation", protect, async (req, res) => {
  const recent = await Incubation.find().sort({ createdAt: -1 }).limit(10);
  res.json(recent);
});

module.exports = router;
