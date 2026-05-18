const express = require("express");
const router = express.Router();

const { matchScholarships } = require("../controller/matchController");
const auth = require("../Middleware/authMiddleware");

router.get("/", auth, matchScholarships);

module.exports = router;
