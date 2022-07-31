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
    let extract = () => {
        let ret = [];
        let table_of_contents = document.querySelectorAll("#toc > ul > * a");
        console.log(table_of_contents);
        table_of_contents.forEach( (title) => {
            // filter out "See also" and "References"
            let id = title.hash;
            if(['#See_also', '#References', '#External_links'].includes(id)) {
                return;
            }

            // get all the links from each section
            let query = document.querySelector(id);
            let links = query.parentNode.nextElementSibling.nextElementSibling.querySelectorAll("a")
            links.forEach( (link) => {
                const title = link.getAttribute('title');
                const url = link.getAttribute('href')
                if(url && title) {
                    ret.push({
                        url: url.trim(),
                        title: title.trim(),
                        description: title.replace('List of ', '').trim()
                    });
                }
            })
        });
        return ret;
    }

    get_data(base+"/wiki/Lists_of_brands", extract).then( (ret) => {
        console.log("Found " + ret.length + " brand types");
        ret.forEach( (brand_type) => {
            console.log(brand_type);
            // setTimeout(function(){
            //     console.log(brand_type);
            //     // get_brands(brand_type);
            // }, 1000);
        })
    }).catch(console.error);
}

function get_brands(brand_type) {
    extract = () => {

    }

    get_data(base+brand_type['url'], extract).then( (ret) => {
        console.log("Found " + ret.length + " " + brand_type['description']);
        ret.forEach( (brand) => {
            console.log(brand);
        })
    }).catch(console.error)
}

get_brand_types()
// get_brands({
//     url: '/wiki/List_of_brand_name_snack_foods',
//     title: 'List of brand name snack foods',
//     description: 'brand name snack foods'
// })
