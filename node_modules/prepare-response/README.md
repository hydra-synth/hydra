# prepare-response

Prepare a text resposne to be efficiently sent.  This is useful when you want to completly cache a specific response in memory and handle etags and gzip.

[![Build Status](https://img.shields.io/travis/ForbesLindesay/prepare-response/master.svg)](https://travis-ci.org/ForbesLindesay/prepare-response)
[![Dependency Status](https://img.shields.io/gemnasium/ForbesLindesay/prepare-response.svg)](https://gemnasium.com/ForbesLindesay/prepare-response)
[![NPM version](https://img.shields.io/npm/v/prepare-response.svg)](https://www.npmjs.org/package/prepare-response)

## Installation

    npm install prepare-response

## Usage

Exports a function with the signature `prepare(body, headers)`, where body is a Buffer or String and headers is an Object.

```js
var express = require('express');
var prepare = require('prepare-response');

var app = express();

var html = prepare('<!DOCTYPE html><html></html>', {'content-type': 'html'}, {
  etag: true, // default: true
  gzip: true // default: true
});
var script = prepare('alert("foo");', {'content-type': 'js', 'cache-control': '1 year'});

app.get('/', function (req, res, next) {
  html.send(req, res, next);
});
app.get('/client.js', function (req, res, next) {
  script.send(req, res, next);
});
```

All headers are passed through as is, except `cache-control` and `content-type`.

- `cache-control` - If you pass a number in milliseconds, or a string in the format accepted by [ms](https://www.npmjs.org/package/ms) it will be converted to the appropriate public cache header.
- `content-type` - If you don't pass a valid content-type, it will be looked up using [mime](https://github.com/broofa/node-mime).

## License

  MIT
