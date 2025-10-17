require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/adminAuth");
const adminDashboardRoutes = require("./routes/adminDashboard");

const app = express();

// Middleware
app.use(cors({ origin: "*", methods: ["GET","POST"], credentials: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminDashboardRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Routes
const formsRoutes = require("./routes/forms");
app.use("/api/form", formsRoutes);

const aiLabRoutes = require("./routes/aiLab");
app.use("/api/ai-lab", aiLabRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
