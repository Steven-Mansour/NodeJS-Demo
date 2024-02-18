const mysql = require('mysql2');
const fs = require('fs');

/* to create the db
CREATE DATABASE nodeDemo;
USE nodeDemo;
CREATE TABLE IF NOT EXISTS file (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    data MediumBLOB NOT NULL
); */

class db {
    constructor() {
        // Connecting to the DB
        this.con = mysql.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "0000",
            database: "nodeDemo"
        });

        this.con.connect(function (err) {
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
            this.con.query('SELECT name, id as identifier  FROM file', (err, results) => {
                if (err) {
                    console.error('Error retrieving files from the database:', err);
                    reject(err);
                    return;
                }
                const filesList = results.map(row => ({
                    name: row.name,
                    id: row.identifier
                }));

                resolve(filesList);
            });
        });
    }

    downloadFile(id) {
        return new Promise((resolve, reject) => {
            this.con.query('SELECT name, data FROM file WHERE id = ?', [id], (err, results) => {
                if (err) {
                    console.error('Error retrieving file from the database:', err);
                    reject(err);
                    return;
                }

                const fileData = results[0];
                if (!fileData) {
                    reject(new Error(`File with ID ${id} not found in the database`));
                    return;
                }
                const filename = fileData.name;
                const data = fileData.data;

                const filePath = `./${filename}`; // Renamed path to filePath
                fs.writeFile(filePath, data, 'binary', (err) => {
                    if (err) {
                        console.error('Error saving file:', err);
                        reject(err);
                        return;
                    }
                    console.log('File saved successfully.');
                    resolve(filePath); // Resolve with the path where the file is saved
                });
            });
        });
    }


    // Close the database connection
    end() {
        this.con.end();
    }
}



module.exports = db;
