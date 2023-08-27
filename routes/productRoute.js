const express = require('express');
const {
    create, 
    products,
    show,
    update,
    destroy,
} = require('../controllers/ProductController');
const router = express.Router();


router.post('/create', create);
router.get('/all', products);
router.get('/:id', show);
router.put('/update/:id', update);
router.delete('/delete/:id', destroy);

module.exports = router;