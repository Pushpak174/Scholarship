const express = require("express");
const router = express.Router();

const {
  getScholarships,
  saveScholarship,
  unsaveScholarship,
  getSavedScholarships
} = require("../controller/scholarshipController");

const auth = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/authMiddlewareOptional");

/* ---------- ROUTES ---------- */

router.get("/", optionalAuth, getScholarships);
router.get("/saved", auth, getSavedScholarships);

router.post("/:id/save", auth, saveScholarship);
router.post("/:id/unsave", auth, unsaveScholarship);

module.exports = router;

