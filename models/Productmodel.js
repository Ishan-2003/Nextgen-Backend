const mongoose = require('mongoose'); // Erase if already required
const { stringify } = require('querystring');//find use of stringify in model.js

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: false,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        // ref:"Category"
        required: true,
    },
    brand: {
        type: String,
        // enum : ["Xiomi","Samsung","HP"],
        required: 1,
    },
    image: {
        type: String,
        required: 0,
    },
    slug:{
        type:String,
        required:false,
        unique:true,
        lowercase:true,
    }

}, {
    timestamps: true,
});


//Export the model
module.exports = mongoose.model('Product', productSchema);
