'use strict';

var browserify = require('browserify');

function compile(path, options) {
  var bundle = browserify(browserifyOptions(options));
  if (options.plugins) {
    var plugins = options.plugins; // in the format options.plugins = [{plugin: plugin, options: options}, {plugin: plugin, options: options}, ... ]
    for(var i = 0; i < plugins.length; i++) {
      var obj = plugins[i];
      bundle.plugin(obj.plugin, obj.options);
    }
  }
  if (Array.isArray(path)) {
    for (var i = 0; i < path.length; i++) {
      if (typeof path[i] === 'object') { // obj spec support; i.e. {"jquery": {options...}}
        var spec = path[i];
        var keys = Object.keys(spec);
        keys.forEach(function (key) {
          if (spec[key].run) {
            bundle.add(key, spec[key]);
          } else {
            bundle.require(key, spec[key]);
          }
        })
      } else {
        bundle.require(path[i]);
      }
    }
  } else {
    bundle.add(path);
  }
  for (var i = 0; i < (options.external || []).length; i++) {
    bundle.external(options.external[i]);
  }
  for (var i = 0; i < (options.ignore || []).length; i++) {
    bundle.ignore(options.ignore[i]);
  }
  for (var i = 0; i < (options.transform || []).length; i++) {
    var transform = options.transform[i];

    if (Array.isArray(transform)) {
      bundle.transform(transform[1], transform[0]);
    } else {
      bundle.transform(transform);
    }
  }
  return bundle;
}

function browserifyOptions(middlewareOptions) {
  var options = extend({}, middlewareOptions);

  omit(options, [
    'external',
    'grep',
    'gzip',
    'ignore',
    'minify',
    'plugins',
    'postcompile',
    'postminify',
    'precompile',
    'preminify',
    'transform'
  ]);

  return extend(options, {
    standalone: middlewareOptions.standalone || false,
    cache: middlewareOptions.cache === 'dynamic' ? {} : undefined,
    packageCache: middlewareOptions.cache === 'dynamic' ? {} : undefined
  });
}

function extend(object) {
  for(var n = 1; n < arguments.length; n++) {
    var o = arguments[n];

    Object.keys(o).forEach(function (key) {
      object[key] = o[key];
    });
  }

  return object;
}

function omit(object, properties) {
  properties.forEach(function (prop) {
    delete object[prop];
  });
}

module.exports = compile
