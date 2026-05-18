const express = require("express");
const router = express.Router();

const {
  getScholarships,
  saveScholarship,
  unsaveScholarship,
  getSavedScholarships
} = require("../controller/scholarshipController");

const auth = require("../Middleware/authMiddleware");
const optionalAuth = require("../Middleware/authMiddlewareOptional");

/* ---------- ROUTES ---------- */

router.get("/", optionalAuth, getScholarships);
router.get("/saved", auth, getSavedScholarships);

router.post("/:id/save", auth, saveScholarship);
router.post("/:id/unsave", auth, unsaveScholarship);

module.exports = router;

