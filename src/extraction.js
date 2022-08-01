
module.exports = {
    extract,
    extract_company,
    extract_controversy
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
    let seen = [];

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

        links.forEach( (link) => {
            const link_title = link.getAttribute('title');
            const link_url = link.getAttribute('href');
            if(!link_title) return;
            if(link_title.includes('Edit')) return;
            if(
                link_url && (
                link_url.includes('action=edit') ||
                link_url.includes('/wiki/Wikipedia') ||
                link_url.includes('.jpg') ||
                link_url.includes('.png'))) return;

            if(seen.includes(link_url)) return;

            seen.push(link_url);
    
            ret.push({
                url: link_url,
                title: link_title
            });
        })
    };

    return ret;
}

function extract_controversy() {
    let ret = [];
    let selectors = []
    selectors.push(...document.querySelectorAll("#Criticism"));
    selectors.push(...document.querySelectorAll("#Incidents"));
    selectors.push(...document.querySelectorAll("#Controversies"));
    selectors.push(...document.querySelectorAll("#Controversy"));
    selectors.push(...document.querySelectorAll("#Litigation"));
    selectors.forEach( (section) => {
        let query = section.parentNode.nextElementSibling;
        let controversy_title = '';
        let controversy_text = '';

        while(!['H1', 'H2'].includes(query.tagName)) {

            if(query.tagName === 'H3') {
                if(controversy_title !== '') {
                    ret.push({
                        "title": controversy_title,
                        "text": controversy_text
                    });
                }

                controversy_text = '';
                controversy_title = query.querySelector("span").textContent;
            }

            if(query.tagName === 'P') {
                controversy_text += query.textContent;
            }

            query = query.nextElementSibling;
        }

        if(controversy_title !== '') {
            ret.push({
                "title": controversy_title,
                "text": controversy_text
            });
        }

    });
    return ret;
}
