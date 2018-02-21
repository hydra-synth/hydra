var ms = require('ms');

var reservedKeys = ['normalize', 'env', 'mode'];

exports = module.exports = setter();
exports.env = env;
exports.mode = process.env.NODE_ENV || 'development';


function env(name) {
  if (exports[name]) {
    return exports[name];
  }
  reservedKeys.push(name);
  return exports[name] = setter();
}
function setter(obj) {
  obj = obj || set;
  function set(key) {
    if (arguments.length === 2) {
      obj[key] = arguments[1];
      return this;
    } else if (typeof key === 'object') {
      Object.keys(key)
        .forEach(function (k) {
          obj[k] = key[k];
        });
      return this;
    } else {
      return obj[key];
    }
  }
  return set;
}

exports.external = [];
exports.ignore = [];
exports.ignoreMissing = false;
exports.transform = [];
exports.insertGlobals = false;
exports.detectGlobals = true;
exports.standalone = false;
exports.noParse = [];
exports.extensions = [];
exports.basedir = undefined;
exports.grep = /\.js$/;

//set some safe defaults for
//unknown environemnts
exports.cache = false;
exports.minify = false;
exports.gzip = true;
exports.debug = false;

var production = exports.env('production');
production.cache = true;
production.precompile = true;
production.minify = true;
production.gzip = true;
production.debug = false;

var development = exports.env('development');
development.cache = 'dynamic';
development.precompile = false;
development.minify = false;
development.gzip = false;
development.debug = true;

exports.normalize = normalize;


function normalize(options) {
  var defaults = exports[exports.mode] || {};
  options = options || {};

  Object.keys(defaults)
    .forEach(function (key) {
      if (options[key] === null || options[key] === undefined) {
        options[key] = defaults[key];
      }
    });
  Object.keys(exports)
    .forEach(function (key) {
      if (reservedKeys.indexOf(key) === -1 && (options[key] === null || options[key] === undefined)) {
        options[key] = exports[key];
      }
    });


  if (options.cache === 'dynamic') {
    // leave unchanged
  } else if (typeof options.cache === 'string' && ms(options.cache)) {
    options.cache = 'public, max-age=' + Math.floor(ms(options.cache)/1000);
  } else if (options.cache === true) {
    options.cache = 'public, max-age=60';
  } else if (typeof options.cache === 'number') {
    options.cache = 'public, max-age=' + Math.floor(options.cache/1000);
  } else if (typeof options.cache === 'object') {
    options.cache = (options.cache.private ? 'private' : 'public') + ', max-age='
                  + Math.floor(ms(options.cache.maxAge.toString())/1000);
  }

  options.precompile = !!options.precompile;
  options.external = arrayify(options.external);
  options.ignore = arrayify(options.ignore);
  options.transform = arrayify(options.transform);
  options.noParse = arrayify(options.noParse);
  options.extensions = arrayify(options.extensions);

  return options;
}

function arrayify(val) {
  if (val && !Array.isArray(val) && typeof val !== 'boolean') {
    return [val];
  } else {
    return val;
  }
}
