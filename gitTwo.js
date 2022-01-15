require("chromedriver");

let swd = require("selenium-webdriver");
let fs = require("fs");
let browser = new swd.Builder().forBrowser(`chrome`).build();
let finalData = [];

async function getUrl(url, i) {
  // console.log(finalData , "line no 9");
  let browser = new swd.Builder().forBrowser(`chrome`).build();
    await browser.get(url);
  await browser.wait(swd.until.elementLocated(swd.By.css(".text-bold.wb-break-word")));
  let boxes = await browser.findElements(swd.By.css(".text-bold.wb-break-word"));
  
  finalData[i]["projectsUrls"] = [];
  // console.log("line no.16", finalData);
  for (let l = 0; l < 2; l++) {
    let list = await boxes[l].getAttribute("innerText");
    // console.log(list);
    let obj = {};
    obj[list] = await boxes[l].getAttribute("href");
    
    finalData[i]["projectsUrls"].push(obj);

    
    
  }
  for (let j in finalData[i]["projectsUrls"]) {
    for (let k in finalData[i]["projectsUrls"][j]) {
       keyValue(finalData[i]["projectsUrls"][j][k], i, j);
       
    }
  }
 
  
  

}

async function keyValue( url, i, j) {
  let browser = new swd.Builder().forBrowser(`chrome`).build();
   browser.get(url+"/issues");
   finalData[i]["projectsUrls"][j]["issues"] =[];  
  //  let currentUrl = await browser.getCurrentUrl();
   await browser.wait(swd.until.elementLocated(swd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title")));
   let issues = await browser.findElements(swd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open.markdown-title"));
  //  if(currentUrl != (url + "issues") ||  issues.length==0){
  //    browser.close();
  //    return;
  //  }

  
  
   for(let k in issues){
     if(k==2){
       break;
     }
     let headings = await issues[k].getAttribute("innerText");

    //  console.log(typeof headings , "line no 60");
    //  console.log( headings , "line no 61");
     let urlss = await issues[k].getAttribute("href");
     finalData[i]["projectsUrls"][j].issues.push({"heading" : headings, "urls" : urlss});
      // console.log(urlss , "line no 62");

   }
   
  

}

async function getLink() {
  await browser.get(`https://www.github.com/topics/`);
  await browser.wait(swd.until.elementLocated(swd.By.css(`.topic-box.position-relative.hover-grow.height-full.text-center.border.color-border-muted.rounded.color-bg-default.p-5`)));
  let items = await browser.findElements(swd.By.css(`.topic-box.position-relative.hover-grow.height-full.text-center.border.color-border-muted.rounded.color-bg-default.p-5`));
  let topicName = await browser.findElements(swd.By.css(".f3.lh-condensed.text-center.Link--primary.mb-0.mt-1"));

  for (let i in items) {
    let Name = await topicName[i].getAttribute("innerText");
    let obj = {}
    obj[Name] = await items[i].findElement(swd.By.css("a")).getAttribute(`href`)
    finalData.push(obj);

  }
  for (let i in finalData) {
    for (let j in finalData[i]) {
      await getUrl(finalData[i][j], i);

      
    }
  }

 
   
  // console.log(finalData);
  fs.writeFileSync("gitTwo.json", JSON.stringify(finalData));



}
getLink();


// vinay.patel@pepcoding.com
// 7722952637..