const extract_logic = require('./extraction');
const utils = require('./utils');

const base = 'https://en.wikipedia.org/';

async function get_brand_types() {
    return await utils.get_data(base+"/wiki/Lists_of_brands", extract_logic.extract).then( (ret) => {
        console.log("Found " + ret.length + " brand types");
        return ret;
    }).catch(console.error);
}

async function get_brands(brand_type) {
    return await utils.get_data(base+brand_type['url'], extract_logic.extract).then( (ret) => {
        console.log("Found " + ret.length + " " + brand_type['title'].replace('List of ', ''));
        return ret;
    }).catch(console.error);
}

async function get_companies(brand) {
    let ret = await utils.get_data(base+brand['url'], extract_logic.extract_company).catch(console.error);
    const ret_length = ret.length;
    for(var i = 0; i < ret_length; i++) {
        utils.pause(1000);
        let companies = await get_companies(ret[i])
        ret.push(...companies);
    }
    return ret
}

async function get_all_companies(brand) {
    return await get_companies(brand).then( (ret) => {
        console.log("Found " + ret.length + " companies for " + brand["title"])
        return ret
    }).catch(console.error);
}

async function run() {
    brand_types = await get_brand_types()
    for(var i = 0; i < brand_types.length; i++) {
        brands = await get_brands(brand_types[i])
        for(var ii = 0; ii < brands.length; ii++) {
            companies = await get_all_companies(brands[ii]);
            utils.pause(1250);
        }
        utils.pause(1500);
    }
}

run()
