const mongoose = require('mongoose'); // Erase if already required
const { stringify } = require('querystring');//find use of stringify in model.js

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
        type : String,
        // ref:"Category"
        required : true,
    },
    brand:{
        type: String,
        // enum : ["Xiomi","Samsung","HP"],
        required : 1,
    },
    quantity:{
        type : Number,
        required : true,
    },
    sold:{
        type: Number,
        default: 0,
    },
    images:{
        type : Array,
    },
    color: {
        type: String,
        // enum : ["Black","Brown","Red","Grey"],
        required : 1,
    },
    ratings:[
        {
            star: Number,
            postedby: {type: mongoose.Schema.Types.ObjectId,ref : "User"}
        },
    ],
},{
    timestamps: true,
});


//Export the model
module.exports = mongoose.model('Brand', brandSchema);
