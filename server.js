var http = require('http');
var httpProxy = require('http-proxy');
var path = require('path');
var url = require('url');
// var express = require('express');
var fs = require('fs');
var path = require('path');
 
var proxy = httpProxy.createProxyServer({});
// var app = new express();

// app.get('/', function(request, response){
//     response.sendfile('yourhtmlpagename.html');
// });

// app.listen(5000);

var webDir = process.env.UI_FOLDER || 'webui-01';

function responseFile(req, res) {
  var filePath = path.join(`${__dirname}/${webDir}${req.url}`);
  var ext = path.extname(url.parse(req.url).pathname);

  if(fs.existsSync(filePath) && ext !== 'cgi') {
    if(filePath.indexOf(webDir)) {
      // res.sendFile(path.join(__dirname+filePath));
      fs.readFile(filePath,function (err, data){
          // res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
          res.write(data);
          res.end();
      });

    } else {
      proxy.web(req, res, { target: 'http://127.0.0.1:5050/' + webDir });  
    }
  } else {
    proxy.web(req, res, { target: 'http://mcnews1.media.netnews.vn:8080' });
  }
}
 
var server = http.createServer(function(req, res) {
  responseFile(req, res);
});

// proxy web socket
server.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});

const PORT = process.env.PORT || 5050;
console.log(`listening on port ${PORT}`);
server.listen(PORT);
