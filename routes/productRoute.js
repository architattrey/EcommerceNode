const express = require('express');
const {create} = require('../controllers/ProductController');
const router = express.Router();


router.post('/create', create);

module.exports = router;