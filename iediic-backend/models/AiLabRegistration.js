const mongoose = require("mongoose");

const aiLabSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    organization: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    interestArea: { type: String },
    message: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiLabRegistration", aiLabSchema);
