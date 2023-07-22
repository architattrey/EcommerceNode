const express = require('express');
const { create } = require('../models/User');
const { 
    createUser, 
    loginUser, 
    users, 
    user, 
    deleteUser,
    updateUser, 
    blockUser, 
    unblockUser,
    handleRefereshToken,
    } = require('../controllers/UserController');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

// users
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/users', users);
router.get('/:id', authMiddleware, isAdmin, user);
router.delete('/:id', deleteUser);
router.put('/update', authMiddleware, updateUser);
router.post('/block-user', authMiddleware, isAdmin, blockUser);
router.post('/unblock-user', authMiddleware, isAdmin, unblockUser);
router.post('/refresh', handleRefereshToken);
module.exports = router;