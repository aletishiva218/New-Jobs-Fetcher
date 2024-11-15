const mongoose = require("./Config.js");


const registeredSchema = mongoose.Schema({
   email:String,
   password:String,
   otp:Number,
   verified:Boolean
})

const usersSchema = mongoose.Schema({
   email:String,
   jobs:Object
})

const registered_users = new mongoose.model("registered_users",registeredSchema)
const users_jobs = new mongoose.model("users_jobs",usersSchema)


module.exports= {registered_users,users_jobs};