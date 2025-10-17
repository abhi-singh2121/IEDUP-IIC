const mongoose = require("mongoose");
const Incubation = require("./models/Incubation");
const PreIncubation = require("./models/PreIncubation");
const Contact = require("./models/Contact");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/iediic";

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    console.log("Incubation forms:", await Incubation.countDocuments());
    console.log("Pre-Incubation forms:", await PreIncubation.countDocuments());
    console.log("Contact forms:", await Contact.countDocuments());
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error connecting:", err.message);
  });
