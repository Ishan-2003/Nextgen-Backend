const express = require('express');
const { createcategory, updateCategory, delete_a_Category, get_a_Category, get_all_Category } = require('../controller/ProdCategorycntrl');
const { authmiddleware, is_Admin } = require('../middlewares/Authmiddleware');
const router = express.Router();

router.post('/create_category', authmiddleware, is_Admin, createcategory)
router.put('/update_category/:id', authmiddleware, is_Admin, updateCategory)
router.delete('/delete_category/:id', authmiddleware, is_Admin, delete_a_Category)
router.get('/get_category/:id', get_a_Category)
router.get('/get_categories',get_all_Category)

module.exports = router;