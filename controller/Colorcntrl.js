const color = require("../models/Colormodel");
const asynchandler = require("express-async-handler")
const slugify = require('slugify');
const creatcolor = asynchandler(async (req, res) => {
    // res.json({
    //     msg: "its product post route",
    // });
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const new_product = await color.create(req.body);
        res.json(new_product);
    }
    catch (err) {
        throw new Error(err);
    }
});

const updatecolor = asynchandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const update_product = await color.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        console.log(update_product)
        res.json(update_product);

    }
    catch (err) {
        throw new Error(err);
    }
});

const deletecolor = asynchandler(async (req, res) => {
    const { id } = req.params;
    try {
        const delete_product = await color.findByIdAndDelete(id);
        res.json(delete_product);
    }
    catch (err) {
        log.error(err.message);
    }
});

const getacolor = asynchandler(async (req, res) => {
    const { id } = req.params;
    try {
        const find_product = await color.findById(id);
        res.json(find_product);
    }
    catch (err) {
        throw new Error(err);
    }
});

const getALLcolor = asynchandler(async (req, res) => {
    // console.log(req.query);
    try {
        //here after creating new product in previous module now we are going to add product filtering
        const qryobj = {...req.query};
        const excludefields = ["page","sort","limit","fields"];
        excludefields.forEach(element => {
            delete qryobj[element];
        });
        let querystring = JSON.stringify(qryobj);
        querystring = querystring.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        // console.log(JSON.parse(querystring));
        let colorr = color.find(JSON.parse(querystring));//we can use var also 
        //Sorting
        if(req.query.sort){
            const sortby = req.query.sort.split(',').join(" ")// what does split and join return
            colorr = colorr.sort(sortby)
        }
        else {
            colorr = colorr.sort('-createdAt');
        }

        //limiting the fields
        
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(" ")
            colorr = colorr.select(fields);
        }
        else{
            colorr = colorr.select('-__v')
        }
        const finalcolorrquery = await colorr;
        res.json(finalcolorrquery);
        // // console.log(qryobj,req.query);
        // const getall_products = await Product.find(qryobj);
        // res.json(getall_products);
    }
    catch (err) {
        throw new Error(err);
    }
});


module.exports = { creatcolor, getacolor, getALLcolor, updatecolor, deletecolor };