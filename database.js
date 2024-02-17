const mysql = require('mysql2');
const fs = require('fs');

class db {
    constructor() {
        // Connecting to the DB
        this.con = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "0000",
            database: "nodeDemo"
        });

        this.con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }

    store_file(file, name) {
        this.con = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "0000",
            database: "nodeDemo"
        });
        this.con.query('INSERT INTO file (name, data) VALUES (?, ?)', [name, file], (err, results) => {
            if (err) throw err;
            console.log('PDF file inserted into the database');
        });
        this.end();
    }

    // Close the database connection
    end() {
        this.con.end();
    }
}

module.exports = db;