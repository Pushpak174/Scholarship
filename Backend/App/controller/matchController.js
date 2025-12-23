const { Scholarship, User } = require("../model/scholarshipmodel");
const calculateMatchScore = require("../utils/mathScore");

async function matchScholarships(req, res) {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.profile) {
      return res.json([]); // 🔥 return empty, not 400
    }

    const { course, gpa, location, categories } = user.profile;

    // minimal profile required
    if (!course || !categories || categories.length === 0) {
      return res.json([]); // 🔥 SAFE EMPTY RESPONSE
    }

    const scholarships = await Scholarship.find();

    const matched = scholarships
      .map((s) => {
        const score = calculateMatchScore(user.profile, s);
        return {
          ...s.toObject(),
          matchScore: score,
        };
      })
      .filter((s) => s.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(matched);
  } catch (err) {
    console.error("match error", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { matchScholarships };
