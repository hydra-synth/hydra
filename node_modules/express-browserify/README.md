# express-browserify

Thin browserify middleware for express.

## Installation

```sh
npm install express --save
npm install express-browserify --save
```

## Usage

```js
var app = require('express')();
var expressBrowserify = require('express-browserify');

app.get(route, expressBrowserify(files, options, callback));
```

## API

### handler = expressBrowserify([files][, options][, callback])

Handler factory. Creates a middlware callback function which can be used with any express request method.

`files` String, Stream, or Array passed to the browserify constructor.

`options` Object with middleware specicfic options and optios passed to the browserify constructor.

`callback` Function passed a reference to the browserify instance to allow additional configuration before the bundle is compiled. Returning false from this callback will override the precompile option. The `.bundle()` method may be called to precompile manually.

#### options

The standard browserify options are passed through directly to the underlying browserify instance.

##### options.require
##### options.external
##### options.ignore
##### options.exclude

These options have been added to allow access to browserify features without having to call browserify methods. Non-null/undefined values are passed directly to the browserify methods of the same name.

##### options.watch

If set to true, all files referenced by the bundle will be watched using watchify, and updates to those files will regenerate the bundle. Defaults to false.

##### options.precompile

If set to true, the bundle will be compiled without waiting for the first request. Otherwise, the first request will trigger the bundle to be compiled. Defeaults to true.

##### options.mutate

This can be a single function or an array of functions. Each function will be passed the compiled source, the options passed to the handler factory, and a next callback.

```js
function(source, options, next) {
	// Modify the source and pass it to the next callback. Pass null as the
	// first argument to indicate no errors.
	next(null, source);
}
```

If there is an error during mutation, either throw the error synchronously call the next method with the error as the first argument.

```js
function(source, options, next) {
	somethingAsync(source, function(err, data) {
		if  (err) {
			next(err);
		} else {
			next(null, data);
		}
	});
}
```

##### options.register

Set a virtual filename for the bundle. This virtual filename can be used with the `.external()` method or "external" option to referenece the bundle.

### expressBrowserify.settings

Default options.

## Internal Browserify Instance

The [browserify](https://github.com/substack/node-browserify) instance that the handler uses internally can be accessed through the factory callback, or the `handler.browserify` property.

```js
var handler = expressBrowserify(function(b) {
	// b is the expressBrowserify instance.
});

// This is the same browserify instance.
handler.browserify;
```

### Browserify Patches

The following additions and modifications are made to the browserify instances that the middleware creates.

#### Watchify

If the "watch" option is true, then browserify will be wrapped using the watchify module. See the [watchify documentation](https://github.com/substack/watchify) for more information.

#### browserify.require()

Modified to accept a single object argument with "file" property. Equivalent to passing an array containing a single object.

#### browserify.ignore()

Modified to accept arrays as well as single values.

#### browserify.exclude()

Modified to accept arrays as well as single values. Values can be `.require()` compatible objects in which case the "expose" or "file" value will be excluded.

#### browserify.register(name)

Makes a bundle referenceable using the `.external()` method or "external" option. Effectively, it makes a bundle behave like it has a filename for external referencing.

#### Event: bundled

Emitted after `.bundle()` has been called and completed successfully. Callbacks are passed the browserified and mutated output.

## Examples

### Single Entry-Point

```js
app.get('/bundle.js', expressBrowserify('./entry.js'));
```

### No Entry-Point With Exposed Modules

```js
app.get('/bundle.js', expressBrowserify({
	require: [
		'foo',
		'./bar.js',
		{ file: './baz.js', expose: 'baz' }
	]
}));
```

### Referencing Another Bundle

Use the `.register()` method or "register" option to set the virtual file name for a bundle.

```js
app.get('/shared.js', expressBrowserify({
	register: '/shared.js',
	require: [...]
});
```

Then, use the virtual file name with the external option just like you would use a real file's name.

```js
app.get('/bundle.js', expressBrowserify('./entry.js', {
	external: [
		// The middleware modified .external() method will replace this with
		// the registered bundle instance.
		'/shared.js'
	]
}));
```