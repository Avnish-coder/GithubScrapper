require("chromedriver");

let swd = require("selenium-webdriver");
const fs = require("fs");
let browser = new swd.Builder().forBrowser(`chrome`).build();
let finalData = [];
let projectsCovered = 0;
let totalProjects = 0;

async function getUrl(url, i) {
  let browser = new swd.Builder().forBrowser(`chrome`).build();
  await browser.get(url);// await
  await browser.wait(swd.until.elementLocated(swd.By.css(".text-bold.wb-break-word")));
  let boxes = await browser.findElements(swd.By.css(".text-bold.wb-break-word"));
  totalProjects += ((boxes.length > 2) ? 2 : boxes.length);
  finalData[i]["projects"] = [];
  for (let j in boxes) {
    if (j == 2) {
      break;
    }

    finalData[i].projects.push({ projectsUrl: await boxes[j].getAttribute("href") });
  }
  let projects = finalData[i].projects;
  for (let j in projects) {
    getIssue(projects[j].projectsUrl, i, j);
  }
   browser.close();
}

async function getIssue(url, i, j) {
  let browser = new swd.Builder().forBrowser(`chrome`).build();
  await browser.get(url + "/issues");//await
  finalData[i].projects[j]["issues"] = [];
  await browser.wait(swd.until.elementLocated(swd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title")));
  let issues = await browser.findElements(swd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title"));
  let currentUrl = await browser.getCurrentUrl();
  if (currentUrl != (url + "/issues") || issues.length == 0) {
    projectsCovered+=1;
     browser.close();
    return;
  }
  for (let k in issues) {
    if (k == 2) {
      break;
    }
    let headings = await issues[k].getAttribute("innerText");
    let urlss = await issues[k].getAttribute("href");
    finalData[i].projects[j].issues.push({ "heading": headings, "urls": urlss });


  }
  projectsCovered += 1;
  console.log(projectsCovered, totalProjects);
  if (projectsCovered == totalProjects) {
    fs.writeFileSync("git.json", JSON.stringify(finalData));
  }

   browser.close();

}

async function getLink() {
  await browser.get(`https://www.github.com/topics/`);
  await browser.wait(swd.until.elementLocated(swd.By.css(`.no-underline.d-flex.flex-column.flex-justify-center`)));
  let items = await browser.findElements(swd.By.css(`.no-underline.d-flex.flex-column.flex-justify-center`));


  for (let io of items) {
    finalData.push({ topicUrl: await io.getAttribute(`href`) });
    
  }
  for (let i in finalData) {
    getUrl(finalData[i].topicUrl, i);
  }
  browser.close();
}
getLink();


// vinay.patel@pepcoding.com
// 7722952637..