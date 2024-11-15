const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


const URL = process.env.MONGO_URL;

mongoose.connect(URL).then(()=>{
console.log("Database connected")
}).catch((error)=>{
    console.log("Error while connecting database: ",error)
})

module.exports= mongoose;