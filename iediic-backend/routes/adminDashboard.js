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

// 🗑️ Delete an entry (any collection)
router.delete("/delete/:type/:id", protect, async (req, res) => {
  try {
    const { type, id } = req.params;
    let Model;

    if (type === "incubation") Model = require("../models/Incubation");
    else if (type === "preincubation") Model = require("../models/PreIncubation");
    else if (type === "contact") Model = require("../models/Contact");
    else if (type === "ai-lab") Model = require("../models/AiLabRegistration");
    else return res.status(400).json({ message: "Invalid type" });

    await Model.findByIdAndDelete(id);
    res.json({ success: true, message: `${type} entry deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting entry" });
  }
});

// ✏️ Edit/Update an entry (for admin)
router.put("/update/:type/:id", protect, async (req, res) => {
  try {
    const { type, id } = req.params;
    let Model;

    if (type === "incubation") Model = require("../models/Incubation");
    else if (type === "preincubation") Model = require("../models/PreIncubation");
    else if (type === "contact") Model = require("../models/Contact");
    else if (type === "ai-lab") Model = require("../models/AiLabRegistration");
    else return res.status(400).json({ message: "Invalid type" });

    const updated = await Model.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating entry" });
  }
});

module.exports = router;
