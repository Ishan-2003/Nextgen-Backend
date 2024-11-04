//verify jwt and auth user

const User = require('../models/Usermodel');
const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");

const authmiddleware = asynchandler(async (req, res, next) => {
    let token;
    // console.log(req.headers);
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];//get second val of token array
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_PRIVATEKEY);
                const user = await User.findById(decoded?.id);
                req.user = user;
                // console.log(user._id)
                next();
            }
        }
        catch (err) {
            throw new Error("Authorization failed due to expired Token")
        }
    }
    else {
        // console.log('token not found')
        throw new Error("No token attached to header");
    }
});

const is_Admin = asynchandler(async (req, res, next) => {
    // console.log(req.user);
    const { email } = req.user;
    // console.log(req.user);
    const adminUser = await User.findOne({ email });
    if(adminUser.role !== "Admin"){
        console.log("auth failed")
        throw new Error("You are not admin");
    }
    else {
        next();
    }
})

module.exports = {authmiddleware,is_Admin};