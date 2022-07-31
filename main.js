const { resolve } = require('path');
const fs = require('fs');
const { Console } = require('node:console');
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
    return await get_data(base+brand['url'], extract_logic.extract_company).then( (ret) => {
        console.log("Found " + ret.length + " companies for " + brand["title"])
        return ret
    }).catch(console.error);
}

async function run() {
    brand_types = await get_brand_types()
    for(var i = 0; i < brand_types.length; i++) {
        brands = await get_brands(brand_types[i])
        // for(var ii = 0; ii < brands.length; ii++) {
        //     companies = await get_companies(brands[ii]);
        //     console.log(companies);
        //     pause(2000);
        // }
        console.log(brand_types[i])
        console.log(brands[0])
        pause(1500);
    }
}

run()
// get_company({
//     url: '/wiki/Tylenol_(brand)',
//     title: 'Tylenol (brand)',
//     section: 'Tylenol'
// })
