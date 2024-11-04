const express = require('express')
const dbConnect = require("./dbConnect")
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cookieparser = require('cookie-parser');
const { notFound, errorHandler } = require("./middlewares/ErrorHandler");
const authRouter = require("./routes/Authroute");
const productrouter = require('./routes/Productroute');
const blogrouter = require('./routes/Blogroute');
const prodcategoryrouter = require('./routes/ProdCategoryroute');
const colorrouter = require('./routes/Colorroute');
const brandrouter = require('./routes/Brandroute');
const blogcategoryrouter = require('./routes/BlogCategoryroute');
require('dotenv').config();
const PORT = process.env.PORT;
const morgan = require("morgan");

dbConnect();
app.get("/",(req,res)=>{res.send("running on and on and on...");});
app.use(cors());
app.use("/api/User",authRouter);
app.use("/api/Product",productrouter);
app.use("/api/Blog",blogrouter);
app.use("/api/Category",prodcategoryrouter);
app.use("/api/Color",colorrouter);
app.use("/api/Brand",brandrouter);
// app.use("/api/BlogCategory",blogcategoryrouter);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieparser());

app.use(notFound);
app.use(errorHandler);


app.listen(PORT,()=>{
    console.log(`Server is running at port num ${PORT}`);
});
