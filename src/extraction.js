
module.exports = {
    extract,
    extract_company
};

function extract() {
    let ret = [];
    let table_of_contents = []
    table_of_contents.push(...document.querySelectorAll("#toc > ul > * a"));
    table_of_contents.push(...document.querySelectorAll("#toc > div > ul > * a"));
    table_of_contents.forEach( (title) => {
        // filter out "See also" and "References"
        let id = title.hash.replace(/[^a-zA-Z_#]/g, "");
        if(['#See_also', '#References', '#External_links'].includes(id)) {
            return;
        }

        // get all the links from each section
        let first_query = document.querySelector(id)
        if(!first_query) return;
        let query = first_query.parentNode.nextElementSibling
        let links = [];
        // get each paragraph until the next header
        while(!['H1', 'H2', 'H3'].includes(query.tagName)) {
            links.push(...query.querySelectorAll("a"));
            query = query.nextElementSibling;
        }
        // extract link and link text
        links.forEach( (link) => {
            const link_title = link.getAttribute('title');
            const link_url = link.getAttribute('href');
            if(!link_title) return;
            if(link_title.includes('Edit')) return;
            if(
                link_url.includes('action=edit') ||
                link_url.includes('/wiki/Wikipedia') ||
                link_url.includes('.jpg') ||
                link_url.includes('.png')) return;
            ret.push({
                url: link_url,
                title: link_title,
                section: title.hash.replace('#', '').replaceAll('_', ' ')
            });
        });
    });
    return ret;
}

function extract_company() {
    let ret = [];

    let company_selectors = [];
    company_selectors.push(document.evaluate("//th[contains(., 'Parent')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext());
    company_selectors.push(document.evaluate("//th[contains(., 'Produced')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext());
    company_selectors.push(document.evaluate("//th[contains(., 'Owner')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext());
    company_selectors.push(document.evaluate("//th[contains(., 'Manufacturer')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext());
    company_selectors.push(document.evaluate("//th[contains(., 'Company')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext());
    company_selectors.push(document.evaluate("//th[contains(., 'Created By')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext());

    // extract data
    for(var i = 0; i < company_selectors.length; i++) {
        company = company_selectors[i];
        if(company === null) continue;
        const links = company.nextElementSibling.querySelectorAll('a')
        const text = company.nextElementSibling.innerText;

        links.forEach( (link) => {
            const link_title = link.getAttribute('title');
            const link_url = link.getAttribute('href');
            if(link_title && link_title.includes('Edit')) return;
            if(
                link_url && (
                link_url.includes('action=edit') ||
                link_url.includes('/wiki/Wikipedia') ||
                link_url.includes('.jpg') ||
                link_url.includes('.png'))) return;
    
            ret.push({
                url: link_url,
                title: link_title,
                text: text
            });
        })
    };

    return ret;
}