const jwt = require("jsonwebtoken");
const {users_jobs,registered_users} = require("../Database/Modal.js");
const {jobPage,amazonJobApi,microsoftJobApi} = require("../utils/jobsFetcher.js");
const sendMail = require("../utils/sendEmail.js");
const dotenv = require("dotenv");
dotenv.config()

const user = {
    create:async (req,res)=>{
        try{
          const { email , password } = req.body;

          const isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
          const isValidEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

          if(!email || !password)
            throw "Email and password is required";

          if(!isValidEmail(email))
            throw "Invalid email";

          const user = await registered_users.findOne({email:email});

          if(user && user.verified==true)
            throw "user already exists";

          if(!isValidPassword(password))
            throw "password should contain at least one uppercase letter, one lowercase letter, one digit, one special character, and is at least 8 characters long";

          const otp = Math.floor(1000 + Math.random() * 9000)

            sendMail(email,otp)

            if(!user)
            await registered_users.create({email:email,password:password,otp:otp,verified:false})
            else
            await registered_users.updateOne({email:email},{$set:{otp:otp}})
              return res.json({status:"Ok",message:"OTP sent to your email, please confirm email"})
        }catch(error){
          return res.json({status:"Not Ok",message:"user not created",error:error})
        }
    },
    verify: async (req,res)=>{
      try{

        const { email , otp } = req.body;
      const isValidEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
      if(!email || !otp)
        throw "email and otp is required";

      if(!isValidEmail(email))
        throw "Invalid email";

      let user = await registered_users.findOne({email:email});

      if(!user)
        throw "Invalid user";

      if(user.verified)
        throw "user already verified";

      if(user.otp!=otp)
        throw "incorrect otp, please submit correct one";

      let newJobs = {
        apple:[],
        google:[],
        microsoft:[],
        amazon:[]
      }

      let appleJobsArr =[];
      let googleJobsArr =[];
      let microsoftJobsArr =[];
      let amazonJobsArr =[];

      for(let i=1;i<=10;i++)
      {
        appleJobsArr.push(jobPage("Apple","https://jobs.apple.com/en-in/search?sort=newest",i,"tbody",".table--advanced-search__title",".table--advanced-search__title"))
        googleJobsArr.push(jobPage("Google","https://www.google.com/about/careers/applications/jobs/results?sort_by=date",i,".sMn82b","div:nth-child(1) div h3","div:nth-child(5) div a"))
        microsoftJobsArr.push(microsoftJobApi(i))
        amazonJobsArr.push(amazonJobApi(i))
      }

      let allJobsArr = await Promise.all([Promise.all(appleJobsArr),Promise.all(googleJobsArr),Promise.all(microsoftJobsArr),Promise.all(amazonJobsArr)])

      allJobsArr.forEach((JobsArr,index)=>{
        JobsArr.forEach(appleJobArr=>{
          appleJobArr.forEach(job=>{
            if(index==0)
            newJobs.apple.push(job)
            if(index==1)
            newJobs.google.push(job)
            if(index==2)
            newJobs.microsoft.push(job)
            if(index==3)
            newJobs.amazon.push(job)
          })
        })
      })
    
    const userJobs = {
      email:email,
      jobs:newJobs
    }

    user = {email:user.email,password:user.password}

        const token = jwt.sign(user,process.env.ACCESS_TOKEN)

    await users_jobs.create(userJobs)
    await registered_users.updateOne({email:email},{$set:{verified:true}})

      return res.json({status:"Ok",message:"email verified",token:token})

      }catch(error){
        return res.json({status:"Not Ok",message:"user not verified",error:error})
      }
    },
    login:async (req,res)=>{
      try{

        const token = req.headers.authorization.split(" ")[1];

        if(!token)
          throw "Token is required";

        const { email , password } = jwt.verify(token,process.env.ACCESS_TOKEN);

        if(!email || !password)
          throw "Email and password is required";

        let user = await registered_users.findOne({email:email,password:password});

        if(!(user && user.verified==true))
          throw "invalid email & password";

          return res.json({status:"Ok",message:"login successfully"})
      }catch(error){
        return res.json({status:"Not Ok",message:"user not logged",error:error})
      }
  }
}

module.exports = user;