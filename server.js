const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const server = http.createServer((req, res) => {

  res.setHeader('Content-Type', 'text/html');

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
      const oldPath = uploadedFile.filepath;

      // where to move the file
      const newPath = './uploads/' + files.file.name;

      // moving the file to the specified location
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('File uploaded and moved successfully');
      });
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
  switch(req.url) {
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