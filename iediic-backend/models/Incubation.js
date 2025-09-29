const mongoose = require("mongoose");

const incubationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    name: { type: String, required: true },
    companyName: { type: String },
    address: { type: String },
    applicantType: { type: String, enum: ["Company", "Individual"], required: true },
    registrationNumber: { type: String },
    visionMission: { type: String },
    coreProducts: { type: String },
    supportsNeeded: { type: String },
    incubationType: { type: String, enum: ["Physical", "Virtual"], required: true },
    paymentScreenshot: { type: String }, // file path
    utrNumber: { type: String },
    companyLogo: { type: String }, // file path
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incubation", incubationSchema);
