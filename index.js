import nodemailer from "nodemailer";
import cron from "node-cron";
import axios, { all } from "axios";
import { htmlToText } from "html-to-text";
import {Jobs} from "./Database/Modal.js";
import dotenv from "dotenv";
dotenv.config();


// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or your email provider
  auth: {
    user: process.env.USER,
    pass: process.env.USERPASS,
  },
});

export default function handler(req, res) {
// Schedule to send email every minute
cron.schedule("* * * * *", async () => {
    try{
        let arr1 = await axios.get("https://gcsservices.careers.microsoft.com/search/api/v1/search?l=en_us&pg=1&pgSz=20&o=Recent&flt=true");
            arr1 = arr1.data.operationResult.result.jobs;
        let arr2 =await axios.get("https://gcsservices.careers.microsoft.com/search/api/v1/search?l=en_us&pg=2&pgSz=20&o=Recent&flt=true");
            arr2 = arr2.data.operationResult.result.jobs;
        let arr3 =await axios.get("https://gcsservices.careers.microsoft.com/search/api/v1/search?l=en_us&pg=3&pgSz=20&o=Recent&flt=true");
            arr3 = arr3.data.operationResult.result.jobs;
        let arr4 =await axios.get("https://gcsservices.careers.microsoft.com/search/api/v1/search?l=en_us&pg=4&pgSz=20&o=Recent&flt=true");
            arr4 = arr4.data.operationResult.result.jobs;
        let arr5 =await axios.get("https://gcsservices.careers.microsoft.com/search/api/v1/search?l=en_us&pg=5&pgSz=20&o=Recent&flt=true");
            arr5 = arr5.data.operationResult.result.jobs;
        
        let allJobs = arr1.concat(arr2);
        allJobs = allJobs.concat(arr3);
        allJobs = allJobs.concat(arr4);
        allJobs = allJobs.concat(arr5);

        allJobs = allJobs.map((job)=>{
            return {
                jobId:job.jobId,
                title:job.title,
                postingDate:job.postingDate,
                description:htmlToText(job.properties.description, {wordwrap: false}),
                locations:job.properties.locations,
                primaryLocation:job.properties.primaryLocation,
                workSiteFlexibility:job.properties.workSiteFlexibility,
                profession:job.properties.profession,
                discipline:job.properties.discipline,
                jobType:job.properties.jobType,
                roleType:job.properties.roleType,
                employmentType:job.properties.employmentType,
                educationLevel:job.properties.educationLevel
            }
        })
        
        allJobs.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));

        let prevJobs = await Jobs.find({});
        prevJobs  = prevJobs.map(job=>{
            return {
                jobId:job.jobId,
                postingDate:job.postingDate
            }
        })
        let prevJobIds = prevJobs.map(job=>job.jobId)

        let filteredJobs = []

        for(let i=0;i<100;i++)
        {
            if(!prevJobIds.includes(allJobs[i].jobId))
                filteredJobs.push(allJobs[i])
        }

        filteredJobs.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));

        
        for(let i=0;i<filteredJobs.length;i++)
            {
                console.log("hello")
                prevJobs.pop()
            }
        
        for(let i=filteredJobs.length-1;i>=0;i--)
        {
            prevJobs.unshift(filteredJobs[i])
        }

        console.log(filteredJobs.length,allJobs.length,prevJobs.length)

        await Jobs.deleteMany({})

        await Jobs.insertMany(prevJobs)
        

        let showdata = " ";

        for(let i=0;i<filteredJobs.length;i++)
        {
            showdata = showdata+`**Job ${i+1}**`+"\n";
            showdata = showdata+"Title :- "+filteredJobs[i].title+"\n\n";
            showdata = showdata+"Posting Date :- "+filteredJobs[i].postingDate+"\n\n";
            showdata = showdata+"Description :- "+filteredJobs[i].description+"\n\n";
            showdata = showdata+"Locations :- "+filteredJobs[i].locations[0]+"\n\n";
            showdata = showdata+"Primary Locations :- "+filteredJobs[i].primaryLocation+"\n\n";
            showdata = showdata+"Work Site Flexibility :- "+filteredJobs[i].workSiteFlexibility+"\n\n";
            showdata = showdata+"Profession :- "+filteredJobs[i].profession+"\n\n";
            showdata = showdata+"Discipline :- "+filteredJobs[i].discipline+"\n\n";
            showdata = showdata+"Job Type :- "+filteredJobs[i].jobType+"\n\n";
            showdata = showdata+"Role Type :- "+filteredJobs[i].roleType+"\n\n";
            showdata = showdata+"Employment Type :- "+filteredJobs[i].employmentType+"\n\n";
            showdata = showdata+"Education Level :- "+filteredJobs[i].educationLevel+"\n\n";
            showdata = showdata+"--------------------------------------------------------------------------\n\n";
        }

            const mailOptions = {
            from: "aletishiva218@gmail.com",
            to: "aletishiva218@gmail.com",
            subject: "Automated Email",
            text: showdata
          };
        if(filteredJobs.length>0)
        {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log("Error:", error);
                } else {
                  console.log("Email sent:", info.response);
                }
              });  
        }
    }catch(error){
        console.log("Error: ",error)
    }
});
}
