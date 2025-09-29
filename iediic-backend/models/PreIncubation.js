const mongoose = require("mongoose");

const preIncubationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    contactnumber: { type: String, required: true },
    applicantName: { type: String, required: true },
    companyName: { type: String },
    address: { type: String },
    applicantType: { type: String, enum: ["Company", "Individual"], required: true },
    businessIdea: { type: String },
    verified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PreIncubation", preIncubationSchema);
