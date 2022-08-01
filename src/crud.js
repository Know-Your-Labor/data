var mysql = require('mysql');

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

module.exports = {
    add_company_controversy,
    add_brand_controversy,
    add_company,
    add_brand
}

function add_brand(brand, brand_type) {
    while(!connected) {/* do nothing */}

    let sql = '';
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
    });
}

function add_company(company) {
    while(!connected) {/* do nothing */}

    let sql = '';
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
    });
}

function add_company_controversy(controversy, company) {
    while(!connected) {/* do nothing */}

    let sql = '';
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
    });
}

function add_brand_controversy(controversy, brand) {
    while(!connected) {/* do nothing */}

    let sql = '';
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + result);
    });
}
