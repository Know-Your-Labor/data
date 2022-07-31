const puppeteer = require('puppeteer');

function run () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://en.wikipedia.org/wiki/Lists_of_brands");
            let urls = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('a');
                items.forEach((item) => {
                    results.push({
                        url:  item.getAttribute('href'),
                        title:  item.getAttribute('title'),
                    });
                });
                const regex = new RegExp('List of.*brands', 'g');
                results = results.filter((row) => row['url'] !== null && row['title'] !== null);
                results = results.filter((row) => row['title'].match(regex));
                return results;
            })
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}

run().then(console.log).catch(console.error);
