const express = require('express');
const { creatcolor, getacolor, getALLcolor, updatecolor, deletecolor } = require('../controller/Colorcntrl');
const { is_Admin, authmiddleware } = require('../middlewares/Authmiddleware');

const router = express.Router();
router.post("/create_color", authmiddleware, is_Admin, creatcolor);
router.put("/update_a_color/:id", authmiddleware, is_Admin, updatecolor);
router.delete("/delete_a_color/:id", authmiddleware, is_Admin, deletecolor);
router.get("/getallcolor", getALLcolor);
router.get("/get_a_color/:id", getacolor);

module.exports = router;