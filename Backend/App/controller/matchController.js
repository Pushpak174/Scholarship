const { Scholarship, User } = require("../model/scholarshipmodel");
const calculateMatchScore = require("../utils/mathScore");

async function matchScholarships(req, res) {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.profile) {
      return res.status(400).json({ error: "User profile not found" });
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
    console.error("matchScholarships error:", err);
    res.status(500).json({ error: "Match failed" });
  }
}

module.exports = { matchScholarships };
