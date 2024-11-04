const express = require('express');
const { getAllBlogs, createBlog, updateBlog, get_a_Blog, deleteBlog, liketheBlog, disliketheBlog } = require('../controller/Blogcntrl');
const { authmiddleware, is_Admin } = require('../middlewares/Authmiddleware');
const router = express.Router();

router.post("/create_blog",authmiddleware,is_Admin,createBlog);
router.get("/get_all_Blog",getAllBlogs);
router.put("/update_blog/:id",authmiddleware,is_Admin,updateBlog);
router.get("/get_a_Blog/:id",get_a_Blog);
router.delete("/delete_a_Blog/:id",authmiddleware,is_Admin,deleteBlog);
router.put("/likes_Blog",authmiddleware,is_Admin,liketheBlog);
router.put("/dislikes_Blog",authmiddleware,is_Admin,disliketheBlog);

module.exports = router;