const express = require("express");
const router = express.Router();
const { protect, verifySuperAdmin } = require("../middleware/adminAuth");
const Incubation = require("../models/Incubation");
const PreIncubation = require("../models/PreIncubation");
const Contact = require("../models/Contact");
const AiLabRegistration = require("../models/AiLabRegistration");

// Get counts for dashboard
router.get("/stats", protect, async (req, res) => {
  try {
    const incubation = await Incubation.countDocuments();
    const preIncubation = await PreIncubation.countDocuments();
    const contact = await Contact.countDocuments();
    const aiLabCount = await AiLabRegistration.countDocuments();

    res.json({ incubation, preIncubation, contact, aiLabCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get recent submissions
router.get("/recent-incubation", protect, async (req, res) => {
  const recent = await Incubation.find().sort({ createdAt: -1 }).limit(20);
  res.json(recent);
});

router.get("/pre-incubation", protect, async (req, res) => {
  try {
    const recent = await PreIncubation.find().sort({ createdAt: -1 }).limit(20);
    res.json(recent);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pre-incubation data" });
  }
});

// Contact form entries
router.get("/contact", protect, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(20);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching contact data" });
  }
});

// get ai submission 
router.get("/ai-lab", protect, async (req, res) => {
  const data = await AiLabRegistration.find().sort({ createdAt: -1 });
  res.json(data);
});
module.exports = router;
