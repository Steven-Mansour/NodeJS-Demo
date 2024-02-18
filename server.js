const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable'); //npm install formidable
const db = require('./database');
const dbops = new db();

const server = http.createServer((req, res) => {

  res.setHeader('Content-Type', 'text/html');

  // Check if the request is for fetching files
  if (req.url === '/files' && req.method.toLowerCase() === 'get') {
    dbops.getAllFiles()
      .then(filesList => {
        const fileNames = filesList.map(file => file.name); // Extracting only the names
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(fileNames));
      })
      .catch(error => {
        console.error('Error retrieving files:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      });
    return;
  }

  // file upload
  if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Formidable parsing error:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      console.log('Files:', files); // for debugging

      if (Array.isArray(files.file) && files.file.length > 0) {
        const uploadedFile = files.file[0];

        // temporary location of the uploaded file
        //   const oldPath = files.file.path;
        const path = uploadedFile.filepath;
        const filename = files.file[0].originalFilename;

        // res.writeHead(200, { 'Content-Type': 'text/plain' });
        // res.end('File uploaded and moved successfully');
        var pdfData = fs.readFileSync(path);
        dbops.store_file(pdfData, filename);

        /*dbops.getAllFiles()
          .then(filesList => {
            const htmlContent = fs.readFileSync('index.html', 'utf8'); // Read the HTML template file
            const updatedHtmlContent = htmlContent.replace('FILE_LIST', JSON.stringify(filesList));
            res.writeHead(302, { 'Location': '/' }); // 302 for redirecting
            res.end(updatedHtmlContent);
          })
          .catch(err => {
            console.error('Error retrieving files from the database:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
          });*/

      }
      else {
        console.error('No files uploaded or unexpected file format');
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      }
    });
    return;
  }

  // routing
  let path = './';
  switch (req.url) {
    case '/':
      path += 'index.html';
      res.statusCode = 200;
      break;
    case '/src/input.css':
      path += 'src/style.css';
      res.setHeader('Content-Type', 'text/css');
      res.statusCode = 200;
      break;
    case '/src/output.css':
      path += 'src/output.css';
      res.setHeader('Content-Type', 'text/css');
      res.statusCode = 200;
      break;
    case '/upload':
      path += 'upload.html';
      res.statusCode = 200;
      break;
    default:
      path += '404.html';
      res.statusCode = 404;
  }

  // send html
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    }
    res.end(data);
  });


});

server.listen(5000, 'localhost', () => {
  console.log('listening for requests on port 5000');
});