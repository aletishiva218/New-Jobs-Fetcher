const nodemailer = require("nodemailer");
const cheerio = require("cheerio");
const axios = require("axios");
const {users_jobs} = require("../Database/Modal.js");
const {jobPage,amazonJobApi,microsoftJobApi} = require("../utils/jobsFetcher.js");
const dotenv = require("dotenv");
dotenv.config()

const jobs = {
  apple:async (req,res)=>{
    try {
        const { user } = req.params;
        const userExist = await users_jobs.findOne({email:user})
        if(!userExist)
            throw "user not exists";

        let appleJobsArr =[];
  // let googleJobsArr =[];
  // let microsoftJobsArr =[];
  // let amazonJobsArr =[];

  for(let i=1;i<=10;i++)
  {
    appleJobsArr.push(jobPage("Apple","https://jobs.apple.com/en-in/search?sort=newest",i,"tbody",".table--advanced-search__title",".table--advanced-search__title"))
    // googleJobsArr.push(jobPage("Google","https://www.google.com/about/careers/applications/jobs/results?sort_by=date",i,".sMn82b","div:nth-child(1) div h3","div:nth-child(5) div a"))
    // microsoftJobsArr.push(microsoftJobApi(i))
    // amazonJobsArr.push(amazonJobApi(i))
  }

  // let allJobsArr = await Promise.all([Promise.all(appleJobsArr),Promise.all(googleJobsArr),Promise.all(microsoftJobsArr),Promise.all(amazonJobsArr)])
  appleJobsArr = await Promise.all(appleJobsArr)

  let newJobs = []
  appleJobsArr.forEach(JobsArr=>{
    JobsArr.forEach(job=>{
      newJobs.push(job)
    })
  })
  let filteredJobs = []

        newJobs.forEach((job) => {
            let a = 0;
            for(let i=0;i<200;i++)
            {
              if(job.link==userExist.jobs.apple[i].link)
                break
              a++;
            }
            if(a==200)
              filteredJobs.push(job)
          });

          for(let i=filteredJobs.length-1;i>=0;i--)
            {
              userExist.jobs.apple.unshift(filteredJobs[i])
              userExist.jobs.apple.pop()
            }

            await users_jobs.updateOne({email:user},{$set:{jobs:userExist.jobs}}) 

        return res.json({newJobs:filteredJobs });
        
      } catch (error) {
        return res.json({status:"Not Ok",message:"apple jobs not fetched",error:error})
      }
},
google:async (req,res)=>{
  try {
      const { user } = req.params;
      const userExist = await users_jobs.findOne({email:user})
      if(!userExist)
          throw "user not exists";

      // let appleJobsArr =[];
let googleJobsArr =[];
// let microsoftJobsArr =[];
// let amazonJobsArr =[];

for(let i=1;i<=10;i++)
{
  // appleJobsArr.push(jobPage("Apple","https://jobs.apple.com/en-in/search?sort=newest",i,"tbody",".table--advanced-search__title",".table--advanced-search__title"))
  googleJobsArr.push(jobPage("Google","https://www.google.com/about/careers/applications/jobs/results?sort_by=date",i,".sMn82b","div:nth-child(1) div h3","div:nth-child(5) div a"))
  // microsoftJobsArr.push(microsoftJobApi(i))
  // amazonJobsArr.push(amazonJobApi(i))
}

// let allJobsArr = await Promise.all([Promise.all(appleJobsArr),Promise.all(googleJobsArr),Promise.all(microsoftJobsArr),Promise.all(amazonJobsArr)])
googleJobsArr = await Promise.all(googleJobsArr)

let newJobs = []
googleJobsArr.forEach(JobsArr=>{
  JobsArr.forEach(job=>{
    newJobs.push(job)
  })
})
let filteredJobs = []

      newJobs.forEach((job) => {
          let a = 0;
          for(let i=0;i<200;i++)
          {
            if(job.link==userExist.jobs.google[i].link)
              break
            a++;
          }
          if(a==200)
            filteredJobs.push(job)
        });

        for(let i=filteredJobs.length-1;i>=0;i--)
          {
            userExist.jobs.google.unshift(filteredJobs[i])
            userExist.jobs.google.pop()
          }

          await users_jobs.updateOne({email:user},{$set:{jobs:userExist.jobs}}) 

      return res.json({newJobs:filteredJobs });
      
    } catch (error) {
      return res.json({status:"Not Ok",message:"google jobs not fetched",error:error})
    }
},
    microsoft:async (req,res)=>{
        try {
            const { user } = req.params;
            const userExist = await users_jobs.findOne({email:user})
            if(!userExist)
                throw "user not exists";

            let prevJobs = userExist.jobs.microsoft;

      //       let appleJobsArr =[];
      // let googleJobsArr =[];
      let microsoftJobsArr =[];
      // let amazonJobsArr =[];

      for(let i=1;i<=10;i++)
      {
        // appleJobsArr.push(jobPage("Apple","https://jobs.apple.com/en-in/search?sort=newest",i,"tbody",".table--advanced-search__title",".table--advanced-search__title"))
        // googleJobsArr.push(jobPage("Google","https://www.google.com/about/careers/applications/jobs/results?sort_by=date",i,".sMn82b","div:nth-child(1) div h3","div:nth-child(5) div a"))
        microsoftJobsArr.push(microsoftJobApi(i))
        // amazonJobsArr.push(amazonJobApi(i))
      }

      // let allJobsArr = await Promise.all([Promise.all(appleJobsArr),Promise.all(googleJobsArr),Promise.all(microsoftJobsArr),Promise.all(amazonJobsArr)])
      microsoftJobsArr = await Promise.all(microsoftJobsArr)

      let newJobs = []
      microsoftJobsArr.forEach(JobsArr=>{
        JobsArr.forEach(job=>{
          newJobs.push(job)
        })
      })
      let filteredJobs = []

            newJobs.forEach((job) => {
                let a = 0;
                for(let i=0;i<200;i++)
                {
                  if(job.link==userExist.jobs.microsoft[i].link)
                    break
                  a++;
                }
                if(a==200)
                  filteredJobs.push(job)
              });

              for(let i=filteredJobs.length-1;i>=0;i--)
                {
                  userExist.jobs.microsoft.unshift(filteredJobs[i])
                  userExist.jobs.microsoft.pop()
                }

                await users_jobs.updateOne({email:user},{$set:{jobs:userExist.jobs}}) 

            return res.json({newJobs:filteredJobs });

          } catch (error) {
            return res.json({status:"Not Ok",message:"microsoft jobs not fetched",error:error})
          }
    },
    amazon:async (req,res)=>{
      try {
          const { user } = req.params;
          const userExist = await users_jobs.findOne({email:user})
          if(!userExist)
              throw "user not exists";
    
          // let appleJobsArr =[];
    // let googleJobsArr =[];
    // let microsoftJobsArr =[];
    let amazonJobsArr =[];
    
    for(let i=1;i<=10;i++)
    {
      // appleJobsArr.push(jobPage("Apple","https://jobs.apple.com/en-in/search?sort=newest",i,"tbody",".table--advanced-search__title",".table--advanced-search__title"))
      // googleJobsArr.push(jobPage("Google","https://www.google.com/about/careers/applications/jobs/results?sort_by=date",i,".sMn82b","div:nth-child(1) div h3","div:nth-child(5) div a"))
      // microsoftJobsArr.push(microsoftJobApi(i))
      amazonJobsArr.push(amazonJobApi(i))
    }
    
    // let allJobsArr = await Promise.all([Promise.all(appleJobsArr),Promise.all(googleJobsArr),Promise.all(microsoftJobsArr),Promise.all(amazonJobsArr)])
    amazonJobsArr = await Promise.all(amazonJobsArr)
    
    let newJobs = []
    amazonJobsArr.forEach(JobsArr=>{
      JobsArr.forEach(job=>{
        newJobs.push(job)
      })
    })
    let filteredJobs = []
    
          newJobs.forEach((job) => {
              let a = 0;
              for(let i=0;i<200;i++)
              {
                if(job.link==userExist.jobs.amazon[i].link)
                  break
                a++;
              }
              if(a==200)
                filteredJobs.push(job)
            });
    
            for(let i=filteredJobs.length-1;i>=0;i--)
              {
                userExist.jobs.amazon.unshift(filteredJobs[i])
                userExist.jobs.amazon.pop()
              }
    
              await users_jobs.updateOne({email:user},{$set:{jobs:userExist.jobs}}) 
    
          return res.json({newJobs:filteredJobs });
          
        } catch (error) {
          return res.json({status:"Not Ok",message:"amazon jobs not fetched",error:error})
        }
    }
}

module.exports = jobs;

