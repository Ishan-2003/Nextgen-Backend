const express = require('express');
const { creatProduct, getaProduct, getALLproducts, updateProduct, deleteProduct } = require('../controller/Brandcntrl');
const { is_Admin, authmiddleware } = require('../middlewares/Authmiddleware');

const router = express.Router();
router.post("/", authmiddleware, is_Admin, creatProduct);
router.put("/update_a_prod/:id", authmiddleware, is_Admin, updateProduct);
router.delete("/delete_a_prod/:id", authmiddleware, is_Admin, deleteProduct);
router.get("/getallprod", getALLproducts);
router.get("/get_a_prod/:id", getaProduct);

module.exports = router;