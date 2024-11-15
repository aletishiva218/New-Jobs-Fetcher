const express = require("express");
const user = require("./Routes/user.js");
const jobs = require("./Routes/jobs.js");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.post("/api/user/create",user.create)

app.post("/api/user/login",user.login)

app.put("/api/user/verify",user.verify)

app.get("/api/jobs/apple/:user", jobs.apple);

app.get("/api/jobs/microsoft/:user", jobs.microsoft);

app.get("/api/jobs/google/:user", jobs.google);

app.get("/api/jobs/amazon/:user", jobs.amazon);

app.listen(process.env.PORT, () => console.log(`server is running at ${process.env.PORT}`));
