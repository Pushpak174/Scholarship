const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  signup,
  login,
  getMe,
  updateProfile,
} = require("../controller/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);

module.exports = router;
