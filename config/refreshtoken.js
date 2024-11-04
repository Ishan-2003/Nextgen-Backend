const jwt = require("jsonwebtoken");

const gen_refresh_token = (id) => {
    return jwt.sign({ id }, process.env.JWT_PRIVATEKEY, { expiresIn: '3d' });
};

module.exports = { gen_refresh_token };