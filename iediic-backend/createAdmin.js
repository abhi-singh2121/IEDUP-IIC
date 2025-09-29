// createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import Admin model
const Admin = require("./models/Admin");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Create new admin
async function createAdmin() {
  try {
    const username = "superadmin";  // Add a username
    const name = "Super Admin";
    const email = "superadmin@example.com";
    const password = "password123"; 
    const role = "superadmin"; // or "admin"

    // Check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("Admin with this email already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      username,       // ✅ Required field
      name,
      email,
      password: hashedPassword,
      role
    });

    await admin.save();
    console.log(`✅ Admin created! Email: ${email}, Password: ${password}, Username: ${username}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
