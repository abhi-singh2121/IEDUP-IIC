const express = require("express");
const router = express.Router();
const multer = require("multer");

// ✅ Import your controller functions
const { submitIncubationForm, submitPreIncubationForm, submitContactForm } = require("../controllers/forms");

// ✅ Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Routes
router.post(
  "/incubation",
  upload.fields([
    { name: "paymentScreenshot", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 }
  ]),
  submitIncubationForm
);

router.post(
  "/pre-incubation",
  submitPreIncubationForm
);

router.post(
  "/contact",
  submitContactForm
);

module.exports = router;
