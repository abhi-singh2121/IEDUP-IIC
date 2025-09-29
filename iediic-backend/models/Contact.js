const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    subject: { type: String },
    message: { type: String },
    status: { type: String, default: "new" } // new | in-progress | resolved
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
