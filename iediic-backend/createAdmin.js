// createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
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
    const username = "superadmin";      // Required username
    const name = "Super Admin";         // Optional display name
    const email = "superadmin@example.com"; // Email for login
    const password = "password123";     // Plain password (will be hashed by model)
    const role = "superadmin";          // Role: "admin" or "superadmin"

    // Optional: remove existing admin(s) to avoid duplicates
    await Admin.deleteMany({});

    const admin = new Admin({
      username,
      name,
      email,
      password, // ✅ No manual hashing here, model will hash automatically
      role
    });

    await admin.save();
    console.log(`✅ Admin created! Username: ${username}, Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
