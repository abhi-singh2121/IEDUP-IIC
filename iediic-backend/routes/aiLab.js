const express = require("express");
const router = express.Router();
const AiLabRegistration = require("../models/AiLabRegistration");

// POST: submit AI Lab form
router.post("/register", async (req, res) => {
  try {
    const newEntry = new AiLabRegistration(req.body);
    await newEntry.save();
    res.json({ success: true, message: "AI Lab registration submitted successfully!" });
  } catch (err) {
    console.error("AI Lab form error:", err);
    res.status(500).json({ success: false, message: "Server error, please try again later." });
  }
});

// GET: fetch all (for admin dashboard)
router.get("/", async (req, res) => {
  try {
    const entries = await AiLabRegistration.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
