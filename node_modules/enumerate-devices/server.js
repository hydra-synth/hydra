var express = require('express');
var https = require('https');
var http = require('http');
var pem = require('pem');

pem.createCertificate({ days:1, selfSigned:true }, function(err, keys) {
    var options = {
      key: keys.serviceKey,
      cert: keys.certificate
    };

    var app = express();

    app.use(express.static('.'));

    // Create an HTTP service.
    http.createServer(app).listen(8081);
    // Create an HTTPS service identical to the HTTP service.
    https.createServer(options, app).listen(8080);

    console.log('serving on http://localhost:8081 and https://localhost:8080');
});
