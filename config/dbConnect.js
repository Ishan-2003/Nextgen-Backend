//     const connection = mongoose.connect(process.env.MONGODB_URI);
const mongoose = require('mongoose');
const dbConnect = ()=>{
   try {
    // const client = new MongoClient(process.env.MONGODB_URI, {
    //     serverApi: {
    //       version: ServerApiVersion.v1,
    //       strict: true,
    //       deprecationErrors: true,
    //     }
    //   });
    const connection = mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
}
catch(err){
    console.log("Database connection error");
}

}

module.exports = dbConnect;