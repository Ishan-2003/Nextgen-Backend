const jwt = require("jsonwebtoken");

const gen_token = (id) => {
    return jwt.sign({ id }, process.env.JWT_PRIVATEKEY, { expiresIn: '1d' });
};

module.exports = { gen_token };