// App/controllers/userController.js
const { User } = require('../model/scholarshipmodel');

/**
 * Create a simple user (development, no auth)
 * body: { name, email, profile? }
 */
async function createUser(req, res) {
  try {
    const { name, email, profile } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }

    // basic duplicate check
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const user = new User({
      name,
      email,
      passwordHash: 'temp', // placeholder for now
      profile: profile || {}
    });

    await user.save();
    return res.status(201).json({ message: 'User created', user });
  } catch (e) {
    console.error('createUser error', e);
    return res.status(500).json({ error: e.message });
  }
}

/**
 * Get user by id (simple)
 */
async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id).populate('savedScholarships');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (e) {
    console.error('getUser error', e);
    return res.status(500).json({ error: e.message });
  }
}

module.exports = {
  createUser,
  getUser
};
