const express = require('express')
const dbConnect = require("./dbConnect")
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const authRouter = require("./routes/Authroute");
const cookieparser = require('cookie-parser');
const { notFound, errorHandler } = require("./middlewares/ErrorHandler");
const productrouter = require('./routes/Productroute');
const blogrouter = require('./routes/Blogroute');
const prodcategoryrouter = require('./routes/ProdCategoryroute');
const blogcategoryrouter = require('./routes/BlogCategoryroute');
const brandrouter = require('./routes/Brandroute');
const colorrouter = require('./routes/Colorroute');
const morgan = require("morgan");
require('dotenv').config();
const PORT = process.env.PORT;

dbConnect();
app.get("/",(req,res)=>{res.send("running on and on and on...");});
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieparser());
app.use("/api/User",authRouter);
app.use("/api/Product",productrouter);
app.use("/api/Blog",blogrouter);
app.use("/api/Category",prodcategoryrouter);
app.use("/api/BlogCategory",blogcategoryrouter);
app.use("/api/Brand",brandrouter);
app.use("/api/Color",colorrouter);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT,()=>{
    console.log(`Server is running at port num ${PORT}`);
});
