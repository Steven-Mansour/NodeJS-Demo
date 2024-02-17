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
        
    }

    getAllFiles() {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT name FROM file', (err, results) => {
                if (err) {
                    console.error('Error retrieving files from the database:', err);
                    reject(err);
                    return;
                }
                const filesList = results.map(row => row.name);
                resolve(filesList);
            });
        });
    }

    // Close the database connection
    end() {
        this.con.end();
    }
}

module.exports = db;