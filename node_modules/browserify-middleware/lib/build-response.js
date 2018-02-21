'use strict';

var Promise = require('promise');
var prepare = require('prepare-response');
var uglify = require('uglify-js');
var watchify = require('watchify');
var buildBundle = require('./build-bundle');

module.exports = function send(path, options) {
  var bundle = buildBundle(path, options);
  if (!options.cache) {
    return {
      send: function (req, res, next) {
        getResponse(bundle, options).send(req, res, next);
      },
      dispose: noop
    };
  } else if (options.cache === 'dynamic') {
    var response, resolve;
    var updatingTimeout;
    bundle = watchify(bundle, {poll: true, delay: 0});
    bundle.on('update', function () {
      if (resolve) {
        clearTimeout(updatingTimeout);
      } else {
        response = new Promise(function (_resolve) {
          resolve = _resolve;
        });
      }
      updatingTimeout = setTimeout(function rebuild() {
        resolve(getResponse(bundle, options));
        resolve = undefined;
      }, 600);
    });
    response = Promise.resolve(getResponse(bundle, options));
    return {
      send: function (req, res, next) {
        response.done(function (response) { response.send(req, res, next); }, next);
      },
      dispose: function () {
        bundle.close();
      }
    };
  } else {
    return getResponse(bundle, options);
  }
}

function getResponse(bundle, options) {
  var headers = {'content-type': 'application/javascript'};
  if (options.cache && options.cache !== 'dynamic') {
    headers['cache-control'] = options.cache;
  }
  var response = getSource(bundle, options).then(function (src) {
    return prepare(src, headers, {gzip: options.gzip})
  }).then(function (response) {
    return syncResponse = response;
  });
  var syncResponse;
  return {
    send: function (req, res, next) {
      if (syncResponse) return syncResponse.send(req, res);
      else return response.done(function (response) { response.send(req, res); }, next);
    },
    dispose: noop
  };
}
function getSource(bundle, options) {
  return new Promise(function (resolve, reject) {
    bundle.bundle(function (err, src) {
      if (err) return reject(err);
      resolve(src);
    });
  }).then(function (src) {
    src = src.toString();
    return options.postcompile ? options.postcompile(src) : src;
  }).then(function (src) {
    return (options.minify && options.preminify) ? options.preminify(src) : src;
  }).then(function (src) {
    if (options.minify) {
      try {
        src = minify(src, options.minify).code;
      } catch (ex) { } //better to just let the client fail to parse
    }
    return (options.minify && options.postminify) ? options.postminify(src) : src;
  });
}

function minify(str, options) {
  if (!options || typeof options !== 'object') options = {};
  options.fromString = true;
  return uglify.minify(str, options);
}

function noop() {
}
