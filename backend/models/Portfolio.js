const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  summary: { type: String },
  skills: [String],
  achievements: [String],   // <-- added achievements array here
  projects: [
    {
      title: String,
      description: String,
      link: String
    }
  ],
  education: [
    {
      degree: String,
      institution: String,
      year: String
    }
  ],
  experience: [
    {
      company: String,
      title: String,
      duration: String,
      description: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);