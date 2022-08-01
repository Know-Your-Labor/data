const puppeteer = require('puppeteer');

module.exports = {
    pause,
    get_data
}

var history = []

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}

async function get_data(link, extract) {
    return new Promise(async (resolve, reject) => {

        if(history.includes(link)) return resolve([]);
        else history.push(link);

        if(link.includes("https://en.wikipedia.org/https://")) return resolve([]);
        if(link.includes("https://en.wikipedia.org/http://")) return resolve([]);

        pause(250);

        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(link);
            let extraction = await page.evaluate(extract)
            browser.close();
            return resolve(extraction);
        } catch (e) {
            return reject(e);
        }
    })
}
