'use strict';

var buildResponse = require('./build-response');
var normalize = require('./settings').normalize;

module.exports = modules;
function modules(modules, options) {
  options = normalize(options);
  if (options.external) {
    options.external = options.external
      .filter(function (name) {
        return modules.indexOf(name) === -1;
      });
  }
  var response = buildResponse(modules, options);
  return function (req, res, next) {
    response.send(req, res, next);
  };
}