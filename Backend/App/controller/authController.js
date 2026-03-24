const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../model/scholarshipmodel");
async function signup(req, res) {
  try {
    const { name, email, password, profile } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      profile,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
}

async function getMe(req, res) {
  const user = await User.findById(req.userId).select("-passwordHash");
  res.json(user);
}

async function updateProfile(req, res) {
  const { course, gpa, location, categories } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userId,
    { profile: { course, gpa, location, categories } },
    { new: true }
  ).select("-passwordHash");

  res.json(user);
}

module.exports = { signup, login, getMe, updateProfile };
