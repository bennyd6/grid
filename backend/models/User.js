const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },  // Replace `username` with `name` if needed
  email:    { type: String, required: true },
  password: { type: String },
  createdAt:{ type: Date, default: Date.now }
});


module.exports = mongoose.model("User", UserSchema);