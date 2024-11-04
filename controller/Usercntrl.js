const { gen_token } = require("../jwtToken");
const User = require("../models/Usermodel");
const Cart = require('../models/CartModel');
const Order = require('../models/OrderModel');
const asynchandler = require("express-async-handler");
const validate_mongodb_id = require("../utils/validate_MongoDBid");
const { gen_refresh_token } = require("../refreshtoken");
const jwt = require('jsonwebtoken');
const { send_Email } = require("./Emailcntrl");
const { resolveObjectURL } = require("buffer");
const crypto = require('crypto');

const createUser = asynchandler(async (req, res) => {
    const email = req.body.email;
    const finduser = await User.findOne({ email });

    if (!finduser) {
        // console.log('success')
        //createUser
        const newUser = await User.create(req.body);
        res.json({ newUser, "msg": "User Created" });
    }
    else {
        // console.log('user created')
        throw new Error("User Already Exists");
        // res.json({'msg':'User Already Exists'})
        // res.json({
        //     Message : "User Already Exists",
        //     success : false,
        // });
        //user exits
    }
});
//login controller
const login_usercntrl = asynchandler(async function (req, res) {
    const { firstname, lastname, email, mobile, password } = req.body;
    // console.log(email,password); checking if email and password are returned properly
    //now check user exists with such credentials or not
    const find_User = await User.findOne({ email });

    // const req_feild_avail = (find_User?.firstname == firstname && find_User?.lastname == lastname && find_User?.email == email && find_User?.mobile == mobile);

    if (find_User && await (find_User.isPassword_matched(password))) {
        const refreshtoken = await gen_refresh_token(find_User?.id);
        console.log(find_User.id);
        const updateuser = await User.findByIdAndUpdate(find_User.id, {
            refreshToken: refreshtoken,
        }, {
            new: true,
        });
        res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });

        res.json({
            _id: find_User?._id,
            firstname: find_User?.firstname,
            lastname: find_User?.lastname,
            email: find_User?.email,
            mobile: find_User?.mobile,
            token: gen_token(find_User?.id)
        });
    }
    else {
        if (!await find_User.isPassword_matched(password)) throw new Error("password not matced!! Try again.")
        else throw new Error("Invalid credentials");
    }
});

//handle refresh token during login

const handle_refresh_token = asynchandler(async (req, res) => {
    const cookie = req.cookies;
    // console.log(cookie);
    if (!cookie?.refreshtoken) throw new Error("No Refresh token in cookies");
    const refreshToken = cookie.refreshtoken;
    // console.log(refreshToken)
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No refresh token present in database/not matched");
    jwt.verify(refreshToken, process.env.JWT_PRIVATEKEY, (err, decoded) => {
        // console.log(decoded)
        if (err || user.id != decoded.id) {
            throw new Error("There is something wrong with refresh token")
        }
        const accesstoken = gen_token(user?.id);
        res.json({ accesstoken });

    });
    res.json(user);
});

// logout functionality
// Note here refreshtoken is genereated token inside the cookie using cookie parser whereas regreshToken(camel case) is the schema associated field
const logout = asynchandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshtoken) throw new Error("No Refresh token in cookies attached");
    const refreshToken = cookie.refreshtoken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshtoken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); //forbidden cookie from now on
    }
    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: "",
    });
    res.clearCookie("refreshtoken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); //forbidden cookie from now on
});



//now we code about : 
// 1. how to get all users
// 2. how to delete all users
// 3. how to update all users

//1. get functionality

const get_all_user = asynchandler(async (req, res) => {
    try {
        const get_users = await User.find();
        res.json(get_users);
    }
    catch (err) {
        throw new Error(err);
    }
})

//2. get a single user functionality

const get_single_user = asynchandler(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    validate_mongodb_id(id);

    // console.log({ id });
    try {
        const get_a_user = await User.findById(id);
        // console.log(get_a_user);
        res.json({
            get_a_user,
        })
    }
    catch (err) {
        throw new Error(err);
    }
})
//3. delete a user

const delete_single_user = asynchandler(async (req, res) => {
    const { _id } = req.params;
    validate_mongodb_id(_id);
    // console.log(req);
    // console.log({ id });
    try {
        const delete_a_user = await User.findByIdAndDelete(id);
        res.json({
            delete_a_user,
        })
    }
    catch (err) {
        throw new Error(err);
    }
});

//4. Update a user
const update_single_user = asynchandler(async (req, res) => {
    const { id } = req.user;
    validate_mongodb_id(id);
    try {
        const update_a_user = await User.findByIdAndUpdate(id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
            {
                new: true,
            });
        res.json(update_a_user);
    }
    catch (err) {
        throw new Error(err);
    }
});

//5. block and unblock user
const block_a_user = asynchandler(async (req, res) => {
    const { id } = req.user;
    validate_mongodb_id(id);

    try {
        const blockuser = await User.findByIdAndUpdate(id, {
            isBlocked: 1,
        }, {
            new: true,
        });
        res.json({
            msg: "User blocked !!",
        });
    }
    catch (err) {
        throw new Error(err);
    }
});
const unblock_a_user = asynchandler(async (req, res) => {
    const { id } = req.user;
    validate_mongodb_id(id);

    try {
        const unblockuser = await User.findByIdAndUpdate(id, {
            isBlocked: 0,
        }, {
            new: true,
        });
        res.json({
            msg: "User unblocked !!",
            unblockuser
        });
    }
    catch (err) {
        throw new Error(err);
    }
});

const update_password = asynchandler(async (req, res) => {
    const { id } = req.user;
    const { password } = req.body;
    validate_mongodb_id(id);
    const user = await User.findById(id);
    if (password) {
        user.password = password;
        const update_password = await user.save();
        // console.log("updated")
        res.status(200).json(update_password);
    }
    else {
        res.json(user);
    }
});

//forgot password token functionality

const fogotPasswordToken = asynchandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new Error("No User exists with this email in database");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const reset_URL = `Fllow this link to reset your password. Link is valid for next 15 minutes from now. <a href='http://localhost:3000/api/user/reset_password/${token}'>Click Here</>`
        const data = {
            to: email,
            text: "hey!!",
            subject: "Forgot password Link",
            htm: reset_URL,
        };
        send_Email(data);
        res.json(token);
    }
    catch (err) {
        throw new Error(err);
    }
});

// reseting password from link sent on email id

const reset_Password = asynchandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    // console.log(user);
    if (!user) throw new Error("Token has expired, try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    console.log("here")
    await user.save();
    res.json(user);
})

const CartHandle = asynchandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body;
    const { _id } = req.user;
    // console.log(color);
    validate_mongodb_id(_id);
    try {
        let newCart = await new Cart(
            {
                userId: _id,
                productId,
                quantity,
                price
            }
        ).save();
        // console.log(newCart);
        res.status(200).json(newCart);
    }
    catch (err) {
        console.log('cart not Created!!!')
    }
})

const createOrder = asynchandler(async (req, res) => {
    const { shippingInfo, OrderedItems, totalPrice, totalPriceAfterDiscount, paymentInfo } = req.body;
    const { _id } = req.user;
    try {
        const order = await Order.create({
            shippingInfo, OrderedItems, totalPrice, totalPriceAfterDiscount, paymentInfo, user: _id
        })
        res.json({
            order,
            success: true
        })
    }
    catch (err) { throw new Error(err); }
})

//from now on we verify mongodb id

module.exports = { createUser, login_usercntrl, get_all_user, get_single_user, delete_single_user, update_single_user, block_a_user, unblock_a_user, handle_refresh_token, logout, update_password, fogotPasswordToken, reset_Password, CartHandle, createOrder };