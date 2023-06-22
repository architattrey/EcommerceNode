const express = require('express');
const { create } = require('../models/User');
const { createUser, loginUser } = require('../controllers/UserController');
const router = express.Router();

// to register a new user
router.post('/register', createUser);
router.post('/login', loginUser);
module.exports = router;