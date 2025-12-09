const express = require('express');
const router = express.Router();
const { createUser, getUser } = require('../controller/userController');

// POST /website/user  -> create a user (dev, no auth)
router.post('/', createUser);

// GET /website/user/:id -> get user (includes savedScholarships)
router.get('/:id', getUser);

module.exports = router;