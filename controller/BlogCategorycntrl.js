const Category = require('../models/BlogCategorymodel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validate_MongoDBid');

const createcategory = asyncHandler(async (req, res) => {
    try {
        const new_category = await Category.create(req.body);
        res.json(new_category);
    }
    catch (err) {
        throw new Error(err);
    }
});
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updated_category = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updated_category);
    }
    catch (err) {
        throw new Error(err);
    }
});
const delete_a_Category = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleted_category = await Category.findByIdAndDelete(id)
        res.json(deleted_category);
    }
    catch (err) {
        throw new Error(err);
    }
});
const get_a_Category = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const get_category = await Category.findById(id)
        res.json(get_category);
    }
    catch (err) {
        throw new Error(err);
    }
});
const get_all_Category = asyncHandler(async (req, res) => {
    try {
        const get_categories = await Category.find()
        res.json(get_categories);
    }
    catch (err) {
        throw new Error(err);
    }
});

module.exports = { createcategory, updateCategory, delete_a_Category, get_a_Category, get_all_Category }