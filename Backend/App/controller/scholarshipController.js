const { Scholarship, User } = require("../model/scholarshipmodel");

/* =====================================================
   GET SCHOLARSHIPS (LIST + FILTERS)
===================================================== */
async function getScholarships(req, res) {
  try {
    const userId = req.userId;

    const {
      category,
      currency,
      minAmount,
      maxAmount,
      course,
      location,
    } = req.query;

    const filter = {};

    // -------- Currency --------
    if (currency) {
      filter.currency = currency;
    }

    // -------- Amount (FIXED) --------
    if (minAmount || maxAmount) {
      filter.amountValue = { $ne: null };

      if (minAmount) {
        filter.amountValue.$gte = Number(minAmount);
      }

      if (maxAmount) {
        filter.amountValue.$lte = Number(maxAmount);
      }
    }

    // -------- Eligibility --------
    if (category) {
      filter["eligibility.categories"] = category;
    }

    if (course) {
      filter["eligibility.courses"] = course;
    }

    if (location) {
      filter["eligibility.locations"] = location;
    }

    const scholarships = await Scholarship.find(filter)
  .sort({ deadline: 1 }); // 🔥 earliest deadline first


    // -------- Saved state --------
    let savedSet = new Set();

    if (userId) {
      const user = await User.findById(userId).select("savedScholarships");
      if (user?.savedScholarships) {
        user.savedScholarships.forEach((id) =>
          savedSet.add(id.toString())
        );
      }
    }

    const data = scholarships.map((s) => ({
      ...s.toObject(),
      isSaved: savedSet.has(s._id.toString()),
    }));

    res.json({ data });
  } catch (err) {
    console.error("getScholarships error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

/* ================= SAVE ================= */
async function saveScholarship(req, res) {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { savedScholarships: req.params.id },
    });
    res.json({ saved: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

/* ================= UNSAVE ================= */
async function unsaveScholarship(req, res) {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $pull: { savedScholarships: req.params.id },
    });
    res.json({ saved: false });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

/* ================= GET SAVED ================= */
async function getSavedScholarships(req, res) {
  try {
    const user = await User.findById(req.userId).populate(
      "savedScholarships"
    );
    res.json(user?.savedScholarships || []);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getScholarships,
  saveScholarship,
  unsaveScholarship,
  getSavedScholarships,
};
