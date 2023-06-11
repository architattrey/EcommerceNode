const express = require('express');
const { create } = require('../models/User');
const { createUser } = require('../controllers/UserController');
const router = express.Router();

// to register a new user
router.post('/register', createUser);
module.exports = router;