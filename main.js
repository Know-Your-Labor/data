const puppeteer = require('puppeteer');
const extract_logic = require('./extraction');

const base = 'https://en.wikipedia.org/';

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}

async function get_data(link, extract) {
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

async function get_brand_types() {
    return await get_data(base+"/wiki/Lists_of_brands", extract_logic.extract).then( (ret) => {
        console.log("Found " + ret.length + " brand types");
        return ret;
    }).catch(console.error);
}

async function get_brands(brand_type) {
    return await get_data(base+brand_type['url'], extract_logic.extract).then( (ret) => {
        console.log("Found " + ret.length + " " + brand_type['title'].replace('List of ', ''));
        return ret;
    }).catch(console.error);
}

async function get_companies(brand) {
    let ret = await get_data(base+brand['url'], extract_logic.extract_company).catch(console.error);
    const ret_length = ret.length;
    for(var i = 0; i < ret_length; i++) {
        let companies = await get_companies(ret[i])
        ret.push(...companies);
    }
    return ret
}

async function get_all_companies(brand) {
    return await get_companies(brand).then( (ret) => {
        console.log("Found " + ret.length + " companies for " + brand["title"])
        console.log(ret);
        return ret
    }).catch(console.error);
}

async function run() {
    brand_types = await get_brand_types()
    for(var i = 0; i < brand_types.length; i++) {
        brands = await get_brands(brand_types[i])
        for(var ii = 0; ii < brands.length; ii++) {
            companies = await get_all_companies(brands[ii]);
            console.log(companies);
            pause(2000);
        }
        pause(1500);
    }
}

// run()
get_all_companies({
    url: '/wiki/Tylenol_(brand)',
    title: 'Tylenol (brand)',
    section: 'Tylenol'
})
