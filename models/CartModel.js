const mongoose = require('mongoose'); // Erase if already required
const { stringify } = require('querystring');//find use of stringify in model.js

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:false
    },
    quantity:{
        type:Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    color : [{
        type : mongoose.Schema.Types.ObjectId,
        ref:'Color'
    }]
},{
    timestamps: true,
});


//Export the model
module.exports = mongoose.model('Cart', cartSchema);
