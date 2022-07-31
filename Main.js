const { resolve } = require('path');
const puppeteer = require('puppeteer');

const base = 'https://en.wikipedia.org/';

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}

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

function extract() {
    let ret = [];
    let table_of_contents = []
    table_of_contents.push(...document.querySelectorAll("#toc > ul > * a"));
    table_of_contents.push(...document.querySelectorAll("#toc > div > ul > * a"));
    console.log(table_of_contents);
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

function get_brand_types() {
    get_data(base+"/wiki/Lists_of_brands", extract).then( (ret) => {
        console.log("Found " + ret.length + " brand types");
        ret.forEach( (brand_type) => {
            console.log(brand_type['title']);
            get_brands(brand_type);
            pause(1000);
        })
    }).catch(console.error);
}

function get_brands(brand_type) {
    get_data(base+brand_type['url'], extract).then( (ret) => {
        console.log("Found " + ret.length + " " + brand_type['title']);
        // ret.forEach( (brand) => {
        //     console.log(brand);
        // })
    }).catch(console.error)
}

get_brand_types()
// get_brands({
//     url: '/wiki/List_of_automotive_fuel_brands',
//     title: 'List of brand name snack foods',
//     description: 'brand name snack foods'
// })
