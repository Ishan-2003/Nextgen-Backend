const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');//for pasword encriptio
const crypto = require('crypto');
const Product = require('../models/Productmodel')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "User",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: [{ type: Map, of: require('../models/CartModel') }],
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: Map, of: Product }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt: Date,//implementing password reset recover using jwt
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})


//to check the password during login window
userSchema.methods.isPassword_matched = async function (entered_password) {
    return await bcrypt.compare(entered_password, this.password)
}

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000 //10 minutes
    return resetToken;
}
//Export the model
module.exports = mongoose.model("User", userSchema);