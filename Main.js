const { resolve } = require('path');
const fs = require('fs');
const { Console } = require('node:console');
const puppeteer = require('puppeteer');

const base = 'https://en.wikipedia.org/';

// const output = fs.createWriteStream('./stdout.log');
// const errorOutput = fs.createWriteStream('./stderr.log');
// const console = new Console({ stdout: output, stderr: errorOutput });

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

function extract() {
    let ret = [];
    let table_of_contents = []
    table_of_contents.push(...document.querySelectorAll("#toc > ul > * a"));
    table_of_contents.push(...document.querySelectorAll("#toc > div > ul > * a"));
    table_of_contents.forEach( (title) => {
        // filter out "See also" and "References"
        let id = title.hash;
        if(['#See_also', '#References', '#External_links'].includes(id)) {
            return;
        }

        // get all the links from each section
        let first_query = document.querySelector(id)
        if(!first_query) return;
        let query = first_query.parentNode.nextElementSibling
        let links = [];
        links.push(...query.querySelectorAll("a"));
        links.push(...query.nextElementSibling.querySelectorAll("a"));
        links.push(...query.nextElementSibling.nextElementSibling.querySelectorAll("a"));
        // links = query.nextElementSibling.querySelectorAll("a");
        links.forEach( (link) => {
            const title = link.getAttribute('title');
            if(!title) return;
            if(title.includes('Edit')) return;
            ret.push({
                url: link.getAttribute('href'),
                title: title,
            });
        });
    });
    return ret;
}

async function get_brand_types() {
    return await get_data(base+"/wiki/Lists_of_brands", extract).then( (ret) => {
        console.log("Found " + ret.length + " brand types");
        return ret;
    }).catch(console.error);
}

async function get_brands(brand_type) {
    // console.log(brand_type);
    return await get_data(base+brand_type['url'], extract).then( (ret) => {
        console.log("Found " + ret.length + " " + brand_type['title'].replace('List of ', ''));
        return ret;
    }).catch(console.error)
}

async function run() {
    brand_types = await get_brand_types()
    for(var i = 0; i < brand_types.length; i++) {
        await get_brands(brand_types[i]).then( (brands) => {
            // console.log(brands);
        });
        pause(1500);
    }
}

run()
