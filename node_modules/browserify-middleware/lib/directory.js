'use strict';

var join = require('path').join;
var fs = require('fs');
var buildResponse = require('./build-response');
var normalize = require('./settings').normalize;

module.exports = directory;
function directory(path, options) {
  options = normalize(options);
  var cache = {};
  return function (req, res, next) {
    var p = join(path, req.path);
    if (cache[p]) return cache[p].send(req, res, next);
    if (options.grep.test(req.path)) {
      fs.stat(p, function (err, stat) {
        if (err || !stat.isFile()) return next();
        cache[p] = buildResponse(p, options);
        cache[p].send(req, res, next);
      });
    } else {
      return next();
    }
  };
}