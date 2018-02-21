'use strict';

var crypto = require('crypto');
var zlib = require('zlib');
var Promise = require('promise');
var ms = require('ms');
var mime = require('mime');

module.exports = prepareResponse;
function prepareResponse(body, headers, options) {
  if (typeof body === 'string') body = new Buffer(body);
  if (!Buffer.isBuffer(body)) {
    return Promise.reject(new TypeError('Text must be either a buffer or a string'));
  }
  options = options || {};
  var result = new Promise(function (resolve, reject) {
    if (options.gzip === false) return resolve(null);
    zlib.gzip(body, function (err, res) {
      if (err) return reject(err);
      else return resolve(res);
    });
  }).then(function (gzippedBody) {
    if (typeof options.gzip !== 'boolean' && gzippedBody.length >= body.length) {
      options.gzip = false;
    }
    return new PreparedResponse(body,
                                options.gzip !== false ? gzippedBody : null,
                                headers,
                                options);
  });
  result.send = function (req, res, next) {
    return result.done(function (response) {
      response.send(req, res);
    }, next);
  };
  return result;
}
function PreparedResponse(body, gzippedBody, headers, options) {
  this.body = body;
  this.gzippedBody = gzippedBody;
  this.etag = md5(body);

  this.headers = Object.keys(headers || {}).map(function (header) {
    var value = headers[header];
    if (header.toLowerCase() === 'cache-control') {
      if (typeof value === 'string' && ms(value)) {
        value = 'public, max-age=' + Math.floor(ms(value) / 1000);
      } else if (typeof headers.cache === 'number') {
        value = 'public, max-age=' + Math.floor(value / 1000);
      }
    }
    if (header.toLowerCase() === 'content-type' && value.indexOf('/') === -1) {
      value = mime.lookup(value);
    }
    return new Header(header, value);
  });
  this.options = options || {};
}
PreparedResponse.prototype.send = function (req, res) {
  this.headers.forEach(function (header) {
    header.set(res);
  });

  if (this.options.etag !== false) {
    //check old etag
    if (req.headers['if-none-match'] === this.etag) {
      res.statusCode = 304;
      res.end();
      return;
    }

    //add new etag
    res.setHeader('ETag', this.etag);
  }

  //add gzip
  if (this.options.gzip !== false) {
    // vary
    if (!res.getHeader('Vary')) {
      res.setHeader('Vary', 'Accept-Encoding');
    } else if (!~res.getHeader('Vary').indexOf('Accept-Encoding')) {
      res.setHeader('Vary', res.getHeader('Vary') + ', Accept-Encoding');
    }
  }
  if (this.options.gzip !== false && supportsGzip(req)) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Length', this.gzippedBody.length);
    if ('HEAD' === req.method) res.end();
    else res.end(this.gzippedBody);
  } else {
    res.setHeader('Content-Length', this.body.length);
    if ('HEAD' === req.method) res.end();
    else res.end(this.body);
  }
};

function Header(key, value) {
  this.key = key;
  this.value = value;
}
Header.prototype.set = function (res) {
  res.setHeader(this.key, this.value);
};

function md5(str) {
  return crypto.createHash('md5').update(str).digest("hex");
}

function supportsGzip(req) {
  return req.headers
      && req.headers['accept-encoding']
      && req.headers['accept-encoding'].indexOf('gzip') !== -1;
}
