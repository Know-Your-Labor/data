const extract_logic = require('./extraction');
const utils = require('./utils');
const crud = require('./crud');

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
    console.log("Found " + ret.length + " companies for " + brand["title"])
    for(var i = 0; i < ret_length; i++) {
        let companies = await get_companies(ret[i])
        ret.push(...companies);
    }
    return ret
}

async function get_all_companies(brand) {
    return await get_companies(brand).catch(console.error);
}

async function get_controversy(company) {
    return await utils.get_data(base+company['url'], extract_logic.extract_controversy).then( (ret) => {
        console.log("Found " + ret.length + " controversies for " + company['title']);
        return ret;
    }).catch(console.error);
}

async function run() {
    brand_types = await get_brand_types()
    for(var i = 50; i < brand_types.length; i++) {
        brands = await get_brands(brand_types[i])
        if(!brands) continue
        for(var ii = 0; ii < brands.length; ii++) {
            brands[ii]["id"] = crud.add_brand(brands[ii], brand_types[i])

            brand_controversies = await get_controversy(brands[ii]);
            brand_controversies.forEach( (controversy) => {
                crud.add_brand_controversy(controversy, brands[ii]);
            })

            companies = await get_all_companies(brands[ii]);
            if(!companies) continue
            for(var iii = 0; iii < companies.length; iii++) {
                companies[iii]["id"] = crud.add_company(companies[iii]);

                controversies = await get_controversy(companies[iii]);

                controversies.forEach( (controversy) => {
                    crud.add_company_controversy(controversy, companies[iii]);
                })
            }
        }
    }
}

run()
