const axios = require("axios");
const cheerio = require("cheerio");

const jobPage = async (name, jobLink, i, mTag, tTag, lTag) => {
    const url = jobLink;
    const items = [];
  
    const { data } = await axios.get(
      url + (name == "Microsoft" ? "&pg=" : "&page=") + i
    );
    const $ = cheerio.load(data);
  
    $(mTag).each((index, element) => {
      const item = {
        title: $(element).find(tTag).text(), // Replace with the correct selector
        link:
          (name == "Google"
            ? "https://www.google.com/about/careers/applications/"
            : name == "Apple"
            ? "https://jobs.apple.com"
            : name == "Amazon"
            ? "https://www.amazon.jobs"
            : "") + $(element).find(lTag).attr("href"), // Replace with the correct selector
      };
      items.push(item);
    });
    return items;
  };
  
  const amazonJobApi = async (i) => {
    const url = "https://www.amazon.jobs/en/search.json?sort=recent&offset=";
    const items = [];
    for (let j = i * 2 - 2; j <= (i - 1) * 2 + 1; j++) {
      const { data } = await axios.get(url + j * 10);
      data.jobs.forEach((element) => {
        items.push({
          title: element.title,
          link: "https://www.amazon.jobs" + element.job_path,
        });
      });
    }
  
    return items;
  };
  
  const microsoftJobApi = async (i) => {
    const url =
      "https://gcsservices.careers.microsoft.com/search/api/v1/search?l=en_us&pgSz=20&o=Recent&flt=true";
    const items = [];
  
    const { data } = await axios.get(url + "&pg=" + i);
    data.operationResult.result.jobs.forEach((element) => {
      items.push({
        title: element.title,
        link:
          "https://jobs.careers.microsoft.com/global/en/job/" +
          element.jobId +
          "/" +
          element.title,
      });
    });
  
    return items;
  };

module.exports = {jobPage,amazonJobApi,microsoftJobApi}