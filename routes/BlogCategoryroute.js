const express = require('express');
const { createcategory, updateCategory, delete_a_Category, get_a_Category, get_all_Category } = require('../controller/BlogCategorycntrl');
const { authmiddleware, is_Admin } = require('../middlewares/Authmiddleware');

const router = express.Router();
router.get('/get_category/:id', get_a_Category)
router.get('/getallCategory',get_all_Category)
router.post('/create_category', authmiddleware, is_Admin, createcategory)
router.put('/update_category/:id', authmiddleware, is_Admin, updateCategory)
router.delete('/delete_category/:id', authmiddleware, is_Admin, delete_a_Category)

module.exports = router;