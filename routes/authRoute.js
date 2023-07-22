const express = require('express');

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
    logout,
    } = require('../controllers/UserController');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

// users
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/users', users);
router.get('/:id', authMiddleware, isAdmin, user);
router.delete('/:id', deleteUser);
router.put('/update', authMiddleware, updateUser);
router.post('/block-user', authMiddleware, isAdmin, blockUser);
router.post('/unblock-user', authMiddleware, isAdmin, unblockUser);
router.post('/refresh', handleRefereshToken);
module.exports = router;