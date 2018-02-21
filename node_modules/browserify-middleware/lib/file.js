'use strict';

var buildResponse = require('./build-response');
var normalize = require('./settings').normalize;

module.exports = directory;
function directory(path, options) {
  options = normalize(options);
  var response = buildResponse(path, options);
  return function (req, res, next) {
    response.send(req, res, next);
  };
}