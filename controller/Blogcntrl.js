const Blog = require("../models/Blogmodel");
const User = require("../models/Usermodel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validate_MongoDBid");
// const cloudinaryUploadImg = require("../utils/");
// const fs = require("fs");
const createBlog = asyncHandler(async (req, res) => {
    try {
        const new_Blog = await Blog.create(req.body);
        res.json(new_Blog);
    } catch (error) {
        throw new Error(error);
    }
});

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const update_Blog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(update_Blog);
    } catch (error) {
        throw new Error(error);
    }
});

const get_a_Blog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getBlog = await Blog.findById(id)
            .populate("likes")
            .populate("dislikes");
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 },
            },
            { new: true }
        );
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }
});
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const liketheBlog = asyncHandler(async (req, res) => {
    const { blogID } = req.body;
    console.log(blogID)
    validateMongoDbId(blogID);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogID);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogID,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogID,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogID,
            {
                $push: { likes: loginUserId },
                isLiked: true,
            },
            { new: true }
        );
        res.json(blog);
    }
});
const disliketheBlog = asyncHandler(async (req, res) => {
    const { blogID } = req.body;
    validateMongoDbId(blogID);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogID);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogID,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    }
    if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogID,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogID,
            {
                $push: { dislikes: loginUserId },
                isDisliked: true,
            },
            { new: true }
        );
        res.json(blog);
    }
});

const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const findBlog = await Blog.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file;
                }),
            },
            {
                new: true,
            }
        );      
        res.json(findBlog);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createBlog, updateBlog, get_a_Blog, getAllBlogs, deleteBlog, liketheBlog, disliketheBlog, uploadImages, };