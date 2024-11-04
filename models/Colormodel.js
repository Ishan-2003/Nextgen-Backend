const mongoose = require('mongoose'); // Erase if already required
const { stringify } = require('querystring');//find use of stringify in model.js

// Declare the Schema of the Mongo model
var colorSchema = new mongoose.Schema({
    slug:{
        type:String,
        unique:true,
        lowercase:true,
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
        type : String,
        // ref:"Category"
    },
    quantity:{
        type : Number,
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
        unique: true,
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
module.exports = mongoose.model('Color', colorSchema);
