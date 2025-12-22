const mongoose = require("mongoose");

/* ================= SCHOLARSHIP ================= */

const ScholarshipSchema = mongoose.Schema({
  title: String,
  provider: String,

  // raw text (display fallback)
  amount: String,

  // structured (FILTER + SORT)
  amountValue: Number,
  currency: { type: String, enum: ["INR", "USD"] },

  eligibility: {
    courses: [String],
    minGPA: Number,
    locations: [String],
    categories: [String],
  },

  deadline: Date,
  description: String,
  url: String,

  source: String,
  tags: [String],
  scrapedAt: { type: Date, default: Date.now },
});

ScholarshipSchema.index({
  title: "text",
  provider: "text",
  description: "text",
  tags: "text",
});

/* ================= USER ================= */

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },

  profile: {
    course: String,
    gpa: Number,
    location: String,
    categories: [String],
  },

  savedScholarships: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Scholarship" },
  ],
});

const Scholarship = mongoose.model("Scholarship", ScholarshipSchema);
const User = mongoose.model("User", UserSchema);

module.exports = { Scholarship, User };
