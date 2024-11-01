import mongoose from "./Config.js";

const jobSchema = mongoose.Schema({
   jobId:String
})

const Jobs = new mongoose.model("job",jobSchema)

export {Jobs};