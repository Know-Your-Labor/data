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
            const title = item.getAttribute('title');
            const url = item.getAttribute('href')
            if(url && title) {
                ret.push({
                    url: url.trim(),
                    title: title.trim(),
                    description: title.replace('List of ', '').trim()
                });
            }
        });
        const regex = new RegExp('List of.*brand.*', 'g');
        ret = ret.filter((row) => row['url'] !== null && row['title'] !== null);
        ret = ret.filter((row) => row['title'].match(regex));
        return ret;
    }

    get_data(base+"/wiki/Lists_of_brands", extract).then( (ret) => {
        console.log("Found " + ret.length + " brand types");
        ret.forEach( (brand_type) => {
            setTimeout(function(){
                get_brands(brand_type);
            }, 1000);
        })
    }).catch(console.error);
}

function get_brands(brand_type) {
    extract = () => {
        let ret = [];
        let table_of_contents = document.querySelectorAll("#toc > ul > * a")
        // filter out "See also" and "References"
        // get all the links from that section
        document.querySelector("#Lists_of_brands").parentNode.nextElementSibling.nextElementSibling.querySelectorAll("a")
    }

    get_data(base+brand_type['url'], extract).then( (ret) => {
        console.log("Found " + ret.length + " " + brand_type['description']);
        ret.forEach( (brand) => {
            console.log(brand);
        })
    }).catch(console.error)
}

// get_brand_types()
get_brands({
    url: '/wiki/List_of_brand_name_snack_foods',
    title: 'List of brand name snack foods',
    description: 'brand name snack foods'
})
