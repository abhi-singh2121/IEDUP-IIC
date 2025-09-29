const Incubation = require("../models/Incubation");
const PreIncubation = require("../models/PreIncubation");
const Contact = require("../models/Contact");

exports.submitIncubationForm = async (req, res) => {
  try {
    console.log("📩 Incoming incubation data:", req.body);
    console.log("📸 Uploaded files:", req.files);

    const data = req.body;

    // Add file paths if uploaded
    if (req.files) {
      if (req.files.paymentScreenshot) data.paymentScreenshot = req.files.paymentScreenshot[0].path;
      if (req.files.companyLogo) data.companyLogo = req.files.companyLogo[0].path;
    }

    const incubation = new Incubation(data);
    await incubation.save();

    res.status(201).json({ success: true, message: "✅ Incubation form submitted successfully!" });
  } catch (err) {
    console.error("❌ Error in submitIncubationForm:", err);
    res.status(500).json({ success: false, message: "Server error!", error: err.message });
  }
};

exports.submitPreIncubationForm = async (req, res) => {
  try {
    console.log("📩 Incoming pre-incubation data:", req.body);

    // Debug: check if model is loaded
    if (!PreIncubation) {
      console.error("❌ PreIncubation model is undefined!");
      return res.status(500).json({ success: false, message: "Model not loaded" });
    }

    const preIncubation = new PreIncubation(req.body);
    await preIncubation.save();

    res.status(201).json({ success: true, message: "✅ Pre-incubation form submitted successfully!" });
  } catch (err) {
    console.error("❌ Error in submitPreIncubationForm:", err);
    res.status(500).json({ success: false, message: "Server error!", error: err.message, stack: err.stack });
  }
};


exports.submitContactForm = async (req, res) => {
  try {
    console.log("📩 Incoming contact data:", req.body);

    const contact = new Contact(req.body);
    await contact.save();

    res.status(201).json({ success: true, message: "✅ Contact form submitted successfully!" });
  } catch (err) {
    console.error("❌ Error in submitContactForm:", err);
    res.status(500).json({ success: false, message: "Server error!", error: err.message });
  }
};
