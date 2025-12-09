const { Scholarship, User } = require("../model/scholarshipmodel");
function parseAmountValue(amount) {
  if (!amount) return null;
  // very simple number extractor (improve later)
  const m = (amount + '').match(/(\d{1,3}(?:[,.\d]*\d)?)/);
  if (!m) return null;
  return Number(m[0].replace(/[,]/g, ''));
}

async function listScholarships(req, res) {

    try {
        const { q, minAmount, maxAmount, course, location, category, deadlineBefore, page = 1, limit = 20, sort = 'deadline' } = req.query;
        const query = {};

        if (q) {
            query.$text = { $search: q }
        }
        if (minAmount) query.amountValue = { ...query.amountValue, $gte: Number(minAmount) };
        if (maxAmount) query.amountValue = { ...query.amountValue, $lte: Number(maxAmount) };
        if (course) query['eligibility.courses'] = course;
        if (location) query['eligibility.locations'] = location;
        if (category) query['eligibility.categories'] = category;
        if (deadlineBefore) query.deadline = { $lte: new Date(deadlineBefore) };
        const skip = (Number(page) - 1) * Number(limit);
        const docs = await Scholarship.find(query)
            .sort({ [sort]: 1 })
            .skip(skip).limit(Number(limit));

        const total = await Scholarship.countDocuments(query);
        res.json({ data: docs, total, page: Number(page) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }

}

async function createScholarship(req, res) {
   try {
    const data = req.body;
    data.amountValue = parseAmountValue(data.amount);
    const s = new Scholarship(data);
    await s.save();
    res.status(201).json(s);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function getScholarship(req, res) {
  try {
    const s = await Scholarship.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json(s);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function saveScholarship(req, res) {
  try {
    // Prefer req.userId (future auth). Fallback to body or query for dev/testing.
    const userId = req.userId || req.body.userId || req.query.userId 
    if (!userId) return res.status(400).json({ error: 'userId required (for testing)' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.savedScholarships) user.savedScholarships = [];
    if (!user.savedScholarships.includes(req.params.id)) {
      user.savedScholarships.push(req.params.id);
      await user.save();
    }
    res.json({ saved: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}


module.exports = { listScholarships, createScholarship, getScholarship, saveScholarship };