var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

var connected = false;
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to db");
    connected = true;
});

var id = 0;

module.exports = {
    add_company_controversy,
    add_brand_controversy,
    add_company,
    add_brand,
    add_brand_company
}

function add_brand(brand, brand_type) {
    while(!connected) {/* do nothing */}
    id += 1;

    let sql = "INSERT INTO know_your_labor.brand VALUES (" + id + ", '" + brand["url"].replaceAll("'", "%27") + "', '" + brand["title"].replaceAll("'", "") + "', '" + brand["section"].replaceAll("'", "") + "', '" + brand_type["section"].replaceAll("'", "") + "');";

    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    return id;
}

function add_brand_company(brand, company) {
    while(!connected) {/* do nothing */}

    let sql = "INSERT INTO know_your_labor.brand_company VALUES (" + brand["id"] + ", " + company["id"] +");";
    
    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    return id;
}

function add_company(company) {
    while(!connected) {/* do nothing */}
    id += 1;

    let sql = "INSERT INTO know_your_labor.company VALUES (" + id + ", '" + company['url'].replaceAll("'", "%27") + "', '" + company['title'].replaceAll("'", "") + "');";

    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    return id;
}

function add_controversy(controversy, url) {
    while(!connected) {/* do nothing */}
    id += 1;

    let child_labor = controversy['text'].toLowerCase().includes('child labor') ||
        controversy['title'].toLowerCase().includes('child labor');;
    let slavery = controversy['text'].toLowerCase().includes('slavery') || 
        controversy['text'].toLowerCase().includes('forced labor') || 
        controversy['title'].toLowerCase().includes('slavery') || 
        controversy['title'].toLowerCase().includes('forced labor');
    let strike = controversy['text'].toLowerCase().includes('strike') || 
        controversy['text'].toLowerCase().includes('worker') || 
        controversy['title'].toLowerCase().includes('strike') ||
        controversy['title'].toLowerCase().includes('worker');
    let environmental = controversy['text'].toLowerCase().includes('environment') ||
        controversy['title'].toLowerCase().includes('environment');

    child_labor = child_labor.toString().toUpperCase();
    slavery = slavery.toString().toUpperCase();
    strike = strike.toString().toUpperCase();
    environmental = environmental.toString().toUpperCase();

    let sql = "INSERT INTO know_your_labor.controversy VALUES (" + id + ", '" + url.replaceAll("'", "%27") + "', '" + controversy['title'].replaceAll("'", "") + "', '" + controversy['text'].replaceAll("'", "") + "', " + child_labor + ", " + slavery + ", " + strike + ", " + environmental + ");";

    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    return id;
}

function add_company_controversy(controversy, company) {
    while(!connected) {/* do nothing */}

    let controversy_id = add_controversy(controversy, brand['url']);

    let sql = "INSERT INTO know_your_labor.company_controversy VALUES (" + company["id"] + ", " + controversy_id +");";
    
    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    return id;
}

function add_brand_controversy(controversy, brand) {
    while(!connected) {/* do nothing */}

    let controversy_id = add_controversy(controversy, brand['url']);

    let sql = "INSERT INTO know_your_labor.brand_controversy VALUES (" + brand["id"] + ", " + controversy_id +");";

    con.query(sql, function (err, result) {
        if (err) throw err;
    });

    return id;
}
