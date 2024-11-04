const express = require('express');
const { createUser, login_usercntrl, get_all_user, get_single_user, delete_single_user, update_single_user, block_a_user, unblock_a_user, handle_refresh_token, logout, update_password, fogotPasswordToken, reset_Password, CartHandle, createOrder } = require('../controller/Usercntrl');
const { is_Admin, authmiddleware } = require('../middlewares/Authmiddleware');

const router = express.Router();

router.get("/",(req,res)=>{res.send('authroute')})
router.post("/register", createUser);
router.post("/fogot-password-token", fogotPasswordToken)
router.put("/reset_password/:token", reset_Password)
router.put("/change_password", authmiddleware, update_password)
//here register login all_users are the endpoints of api/Users/endpoint and are determined during front end dev of various links from landing page
router.post("/login", login_usercntrl);
// router.get("/refresh", handle_refresh_token);
router.get("/all_users", get_all_user);
router.get("/refresh", handle_refresh_token);
router.get("/logouts", logout);
router.get("/:id", authmiddleware, get_single_user);
router.delete("/:id", delete_single_user);
router.put("/edit_user/:id", authmiddleware, update_single_user);
router.put("/block_user/:id", authmiddleware, is_Admin, block_a_user);
router.put("/unblock_user/:id", authmiddleware, is_Admin, unblock_a_user);
router.post('/create-cart',authmiddleware, CartHandle);
router.post('/create-order',authmiddleware, createOrder);
// router.get("/refresh/:id", handle_refresh_token);

module.exports = router;