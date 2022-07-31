const { resolve } = require('path');
const puppeteer = require('puppeteer');

const base = 'https://en.wikipedia.org/';

function get_data(link, extract) {
    return new Promise(async (resolve, reject) => {
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

function get_brand_types() {
    extract = () => {
        let ret = [];
        let items = document.querySelectorAll('a');
        items.forEach((item) => {
            ret.push({
                url:  item.getAttribute('href'),
                title:  item.getAttribute('title'),
            });
        });
        // const regex = new RegExp('List of.*brands', 'g');
        ret = ret.filter((row) => row['url'] !== null && row['title'] !== null);
        // ret = ret.filter((row) => row['title'].match(regex));
        return ret;
    }

    get_data(base+"/wiki/Lists_of_brands", extract).then( (ret) => {
        console.log("Found " + ret.length + " brand types");
        ret.forEach( (brand_type) => {
            get_brands(brand_type);
        })
    }).catch(console.error);
}

function get_brands() {

}

get_brand_types()
