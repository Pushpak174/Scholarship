// App/controllers/scholarshipController.js
const { Scholarship, User } = require("../model/scholarshipmodel");

/**
 * Parse amount string into numeric value and currency.
 * Returns { value: Number|null, currency: "INR"|"USD"|null }
 */
function parseAmountValue(amount) {
  if (!amount) return { value: null, currency: null };

  const str = String(amount).trim();

  // Detect currency symbol (basic)
  let currency = null;
  if (str.includes("$")) currency = "USD";
  else if (str.includes("₹") || str.toLowerCase().includes("inr")) currency = "INR";

  // Remove common currency symbols/commas/spaces
  const cleaned = str.replace(/[₹$,]/g, "").trim();
  const match = cleaned.match(/\d+(\.\d+)?/);
  if (!match) return { value: null, currency };

  return { value: Number(match[0]), currency };
}

async function listScholarships(req, res) {
  try {
    const {
      q,
      minAmount,
      maxAmount,
      currency: currencyQuery, // optional: "INR" or "USD"
      course,
      location,
      category,
      deadlineBefore,
      page = 1,
      limit = 20,
      sort = "deadline"
    } = req.query;

    const query = {};

    if (q) {
      query.$text = { $search: q };
    }
    if (course) query["eligibility.courses"] = course;
    if (location) query["eligibility.locations"] = location;
    if (category) query["eligibility.categories"] = category;
    if (deadlineBefore) query.deadline = { $lte: new Date(deadlineBefore) };

    // Currency filter: if user provided currency, only search that currency
    if (currencyQuery) {
      // sanitize
      const c = String(currencyQuery).toUpperCase();
      if (c === "INR" || c === "USD") query.currency = c;
    }

    // Amount numeric filtering: apply only to amountValue, and only if currency is specified (recommended)
    // If no currency specified, we will still filter amountValue but that may mix currencies (you can change policy)
    if (minAmount || maxAmount) {
      query.amountValue = { ...(query.amountValue || {}) };
      if (minAmount) query.amountValue.$gte = Number(minAmount);
      if (maxAmount) query.amountValue.$lte = Number(maxAmount);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const docs = await Scholarship.find(query)
      .sort({ [sort]: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Scholarship.countDocuments(query);
    const totalPages = Math.ceil(total / Number(limit));
    const hasNext = Number(page) < totalPages;

    return res.json({ data: docs, total, page: Number(page), limit: Number(limit), totalPages, hasNext });
  } catch (err) {
    console.error("listScholarships error", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function createScholarship(req, res) {
  try {
    const data = req.body;

    // Basic validation
    if (!data.title || data.title.trim() === "") return res.status(400).json({ error: "title is required" });
    if (data.deadline && isNaN(new Date(data.deadline).getTime())) return res.status(400).json({ error: "deadline must be a valid date" });

    // Parse amount and currency
    const parsed = parseAmountValue(data.amount);
    data.amountValue = parsed.value;
    data.currency = parsed.currency || data.currency || "INR"; // default to INR if unclear

    const s = new Scholarship(data);
    await s.save();
    return res.status(201).json(s);
  } catch (e) {
    console.error("createScholarship error", e);
    return res.status(400).json({ error: e.message });
  }
}

async function getScholarship(req, res) {
  try {
    const s = await Scholarship.findById(req.params.id);
    if (!s) return res.status(404).json({ error: "Not found" });
    return res.json(s);
  } catch (e) {
    console.error("getScholarship error", e);
    return res.status(500).json({ error: e.message });
  }
}

async function saveScholarship(req, res) {
  try {
    const userId = req.userId || req.body.userId || req.query.userId;
    if (!userId) return res.status(400).json({ error: "userId required (for testing)" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.savedScholarships) user.savedScholarships = [];
    if (!user.savedScholarships.includes(req.params.id)) {
      user.savedScholarships.push(req.params.id);
      await user.save();
    }
    return res.json({ saved: true });
  } catch (e) {
    console.error("saveScholarship error", e);
    return res.status(500).json({ error: e.message });
  }
}

async function updateScholarship(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;

    if (data.title === "") return res.status(400).json({ error: "title cannot be empty" });

    // If amount provided, parse and set both value & currency
    if (data.amount) {
      const parsed = parseAmountValue(data.amount);
      data.amountValue = parsed.value;
      data.currency = parsed.currency || data.currency;
    }

    const updated = await Scholarship.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return res.status(404).json({ error: "Scholarship not found" });

    return res.json(updated);
  } catch (e) {
    console.error("updateScholarship error", e);
    return res.status(500).json({ error: e.message });
  }
}

async function deleteScholarship(req, res) {
  try {
    const id = req.params.id;
    const deleted = await Scholarship.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Scholarship not found" });
    return res.json({ message: "Deleted", id: deleted._id });
  } catch (e) {
    console.error("deleteScholarship error", e);
    return res.status(500).json({ error: e.message });
  }
}

module.exports = {
  listScholarships,
  createScholarship,
  getScholarship,
  saveScholarship,
  updateScholarship,
  deleteScholarship
};
