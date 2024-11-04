const mongoose = require('mongoose');
const validate_mongodb_id = (id) => {
    const is_Valid = mongoose.Types.ObjectId.isValid(id);
    if(!is_Valid) throw new Error ('This id is not valid/found');
};

//from now on we look more about auth we cover refresh token using cookie parser

module.exports = validate_mongodb_id; 