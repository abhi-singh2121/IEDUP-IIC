const mongoose = require("mongoose");
const Admin = require("./models/Admin");

mongoose.connect("mongodb://127.0.0.1:27017/iediic").then(async () => {
  const admins = await Admin.find();
  console.log(admins);
  process.exit();
});
