const express = require('express');
const { create } = require('../models/User');
const { createUser, loginUser, users, user, deleteUser,updateUser } = require('../controllers/UserController');
const router = express.Router();

// users
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/users', users);
router.get('/:id', user);
router.delete('/:id', deleteUser);
router.put('/update/:id', updateUser);
module.exports = router;