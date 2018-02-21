# browserify-middleware

<img src="http://i.imgur.com/6cyfaYS.png" align="right" />

**middleware for browserify v2 with sensible defaults for the ultimate in ease of use**

In addition to the basics, browserify-middleware has the following features out of the box:

 - source-maps are automatically enabled for debugging
 - automatically rebuilds whenever files change in development
 - minification automatically enabled for production
 - gzip automatically enabled for production
 - etags for caching automatically enabled for production

With the exception of serving up directories (which requires `req.path` from express) everything is entirely framework independent.  Simply pass in `req` `res`, and a `callback` that will only be called in the event of an error.

If you think I've missed something, be sure to open an issue or submit a pull request.

[![Build Status](https://img.shields.io/travis/ForbesLindesay/browserify-middleware/master.svg)](https://travis-ci.org/ForbesLindesay/browserify-middleware)
 [![Coverage Status](https://img.shields.io/coveralls/ForbesLindesay/browserify-middleware/master.svg?style=flat)](https://coveralls.io/r/ForbesLindesay/browserify-middleware?branch=master)
[![Dependency Status](https://img.shields.io/david/ForbesLindesay/browserify-middleware.svg)](https://david-dm.org/ForbesLindesay/browserify-middleware)
[![NPM version](https://img.shields.io/npm/v/browserify-middleware.svg)](https://www.npmjs.com/package/browserify-middleware)

## Usage

See `example` directory for a complete server

```javascript
var browserify = require('browserify-middleware');
var express = require('express');
var app = express();

//provide browserified versions of all the files in a directory
app.use('/js', browserify(__dirname + '/client/dir'));

//provide a browserified file at a path
app.get('/js/file.js', browserify(__dirname + '/client/file.js'));

//provide a bundle exposing `require` for a few npm packages.
app.get('/js/bundle.js', browserify(['hyperquest', 'concat-stream']));

//provide a bundle for a few npm packages plus run main.js
app.get('/js/bundle.js', browserify(['hyperquest', 'concat-stream', {__dirname + '/client/main.js': {run: true}}]));

app.listen(3000);
```
## Multiple Bundles Example

Multiple bundles can sometimes lead to better caching performance.  If you had multiple different JavaScript modules in `./client` that all depended on `hyperquest` and `concat-stream` and were used on different pages, you may want to split those two modules into separate files so that they are only loaded once for someone browsing arround the site:

```javascript
var shared = ['hyperquest', 'concat-stream'];
app.get('/js/bundle.js', browserify(shared));
app.use('/js', browserify('./client', {external: shared}))
```

Then on your HTML pages you can just have:

page1.html
```html
<script src="/js/bundle.js"></script>
<script src="/js/beep.js"></script>
```

page2.html
```html
<script src="/js/bundle.js"></script>
<script src="/js/boop.js"></script>
```

This way, booth `beep.js` and `boop.js` can `require` the shared modules (`hyperquest` and `concat-stream`) but they aren't actually contained within that file.

## API

### `browserify('./path/to/file.js'[, options])`

Return the middleware to serve a browserified version of the file.  The file path is relative to the calling module, not to `process.cwd()`.

### `browserify('./path/to/directory/'[, options])`

Return the middleware to serve a browserified version of all the files in a directory.  The directory path is relative to the calling module, not to `process.cwd()`.

### `browserify(['module-a', 'module-b'][, options])`

Return middleware that will expose `require` for each of the modules in the array.  This will work even if those modules are also in the `external` array.

#### `browserify([{'module-d': {expose: 'dee'}}][, options])`

Require `module-d` with custom options (to be passed on to browserify).  In this case `module-d` will be exposed as `dee`.  This can be mixed and matched with plain strings.  Note that these modules must not appear in the `external` array.

### `options` / `settings`

The `options` passed to each middleware function override the defaults specified in `settings`.

Setings has two properties `settings.production` and `settings.development` which specify the default settings for each environment.  The current environment is specified by `settings.mode` and defaults to `process.env.NODE_ENV || 'development'`

Production defaults:

```javascript
production.cache = true; // equivalent to "public, max-age=60"
production.precompile = true;
production.minify = true;
production.gzip = true;
production.debug = false;
```

To update:

```javascript
browserify.settings.production('cache', '7 days');
```

Development defaults:

```javascript
development.cache = 'dynamic';
development.precompile = false;
development.minify = false;
development.gzip = false;
development.debug = true;
```

To update:

```javascript
browserify.settings.development('gzip', true);
```

The following defaults are the same for production and development:

```javascript
external = [];
ignore = [];
ignoreMissing = false;
transform = [];
insertGlobals = false;
detectGlobals = true;
standalone = false;
grep = /\.js$/
```

To update:

```javascript
browserify.settings('external', ['hyperquest']);
//or
browserify.settings({
  ignoreMissing: true,
  insertGlobals: true,
  transform: ['rfileify']
});
```

Custom Environments:

You can also create a new custom environment:

```javascript
var test = browserify.settings.env('test');
test('minify', true);
//or
test({
  debug: true
});
```

#### cache

The cache setting determines how long content can be cached in the client's web browsers (and any caching proxies) and whether or not to cache bundles server side.  Any value other than `false` will result in them being cached server side.  The `'dynamic'` cache option is special.  It works like watchify and only re-compiles the files that have changed.  This is the fastest option for development.  It does not enable any client side caching.

If cache is `true` the client will recieve Cache Control of `"public, max-age=60"`, which caches for 60 seconds.

If cache is a `string` in the form accepted by [ms](https://npmjs.org/package/ms) it becomes: `"public, max-age=" + (ms(cache)/1000)`

If cache is a `number`, it is treated as being in milliseconds so becomes: `"public, max-age=" + (cache/1000)`

If cache is an `object` of the form `{private: true || false, maxAge: '10 minutes'}` it becomes the apropriate string.

If cache is any other `string` it will be sent directly to the client.

**N.B.** that if caching is enabled, the server never times out its cache, no matter what the timeout set for the client.

#### precompile

The precompile setting enables bundles to be precompiled/built and readily cached immediately on server startup. This option is not available when using browserify with a directory.  If `precompile` is set to `true`, the bundle will be compiled & cached at server start.

```javascript
// Precompile a browserified file at a path
app.get('/js/file.js', browserify('./client/file.js', {
  cache: true,
  precompile: true
}));

// Precompile a bundle exposing `require` for a few npm packages.
app.get('/js/bundle.js', browserify(['hyperquest', 'concat-stream'], {
  cache: true,
  precompile: true
}));
```

**N.B.**  It only makes sense to use precompiling when caching is enabled. If caching is disabled, no precompiling will happen.

#### minify

If `minify` is `true`, UglifyJS will be used to minify the resulting code.  This is `true` by default in production.  If you set it to an object, the object will be passed to uglify-js as [options](https://github.com/mishoo/UglifyJS2#the-simple-way):

 - `warnings` (default `false`) - pass `true` to display compressor warnings
 - `mangle` (default `true`) - pass `false` to skip mangling names
 - `output` (default `null`) - pass an object to specify additional [output options](http://lisperator.net/uglifyjs/codegen). The defaults are optimized for best compression.
 - `compress` (default `{}`) - pass `false` to skip compressing entirely.  Pass an object to specify custom [compressor options](http://lisperator.net/uglifyjs/compress).

#### gzip

If `gzip` is `true`, GZip will be enabled when clients support it.  This increases the memory required for caching by aproximately 50% but the speed boost can be considerable.  It is `true` by default in production.

#### debug

If `debug` is `true`, a source map will be added to the code.  This is very useful when debugging.  `debug` is `false` in production.

#### basedir

If `debug` is `true` you can provide a `string` pathname for basedir and the paths of your files in the source-map will be displayed relative to that file.  This is great for hiding the details of your local file system or tidying up the debugging of a large app.

#### plugins

An array of objects of the form `{plugin: 'name', options: {object}}`.

#### grep

The regular expression, something like [`/\.(?:js|coffee|ls)$/`](http://tinyurl.com/pawk7cu), that a filename must pass to be served using browserify from a directory.

#### hooks

There are a number of hooks that you can implement to modify the source at a few stages of processing.

e.g.

```js
app.get('/index.js', browserify('/index.js', {
  preminify: function (source) {
    return angularJsMinifier(source);
  }
}));
```

The available hooks are currently:

 - postcompile - fires after compilation, but before any minfication/gzipping
 - preminify - fires before minfication (but only if minify is enabled)
 - postminify - fires after minfication (but only if minify is enabled)

The main use case you might have for this would be adding extra minfication steps that are able to make additional assumptions about your code.

#### Others

The remaining settings are all passed through to browserify, you should look at [the browserify readme](https://github.com/substack/node-browserify) if you want to know more:

- `options.external` - an array of module names that will be required from external bundles (see [browserify/multiple bundles](https://github.com/substack/node-browserify#multiple-bundles)) (default: `[]`)
- `options.ignore` - an aray of module names that are prevented from showing up in the output bundle (default: `[]`)
- `options.ignoreMissing` - set to `true` to ignore errors when a module can't be found (default: `false`).
- `options.transform` - an array of transforms to transform top level modules (default: `[]`). Each item can be:
    - `"transform-name"` - the npm name of the transform
    - `transformFunction` - the transform function
    - `["transform-name" | tranformFunction, {option1: true, ...}]` - the transform and some options
- `options.insertGlobals` - set to true to always insert `process`, `global` etc. without analysing the AST for faster builds but larger bundles (Note that `options.minify` may cause the globals to be removed again anyway) (default: false)
- `options.detectGlobals` - set to false to skip adding `process`, `global` etc.  Setting this to false may break more npm modules (default: true).
- `options.noParse` - an array of module names that should not be parsed for `require` statements of node.js style globals, can speed up loading things like jQuery that are huge but never use `require`.
- `options.standalone` - generate a standalone build (in a [umd](https://github.com/ForbesLindesay/umd) wrapper) with this name, you probably don't want this.
- `options.extensions` - an array of optional extra extensions for the module lookup machinery to use when the extension has not been specified. By default browserify considers only `.js` and `.json` files in such cases.
- `options.resolve` - lets you override the default resolution algorithm (e.g. use browserify to compile component modules)
- `options.basedir` - this shouldn't be needed as browserify-middleware already resolves to absolute paths.

You can optionally pass a single item instead of an array to any of the options that take an array.

## License

  MIT

  If you find it useful, a donation via [gittip](https://www.gittip.com/ForbesLindesay) would be appreciated.
