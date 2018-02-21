'use strict';

var path = require('path');
var normalize = path.normalize;
var resolve = path.resolve;
var dirname = path.dirname;
var stat = require('fs').statSync;

exports = module.exports = browserify;
function browserify(path, options) {
  if (Array.isArray(path)) {
    return exports.modules(path, options);
  }
  path = resolve(path);
  options = exports.settings.normalize(options);
  options.noParse = options.noParse.map(function (path) {
    if (path[0] != '.') return path; //support `['jquery']` as well as `['./src/jquery.js']`
    return resolve(path);
  });
  if (stat(path).isDirectory()) {
    return exports.directory(path, options);
  } else {
    return exports.file(path, options);
  }
}
exports.directory = require('./lib/directory');
exports.file = require('./lib/file');
exports.modules = require('./lib/modules');

exports.settings = require('./lib/settings');
