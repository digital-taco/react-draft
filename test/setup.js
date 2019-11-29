const puppeteer = require('puppeteer');
const openBrowsers = [];

function renderPage(config) {
  return new Promise((resolve) => {
    setTimeout(() => { // give time for the server to load up before we begin the tests
      (async () => {
        const browser = await puppeteer.launch(config);
        const page = await browser.newPage();
        await page.goto(`http://localhost:8080/`, {waitUntil : ['load', 'domcontentloaded']});
        openBrowsers.push(browser)
        resolve({browser, page})
      })();
    }, 50)
  })
}

const cleanup = (async (done) => {
  await Promise.all(openBrowsers.map(browser => browser.close()))
  done()
});

module.exports = { renderPage, cleanup }