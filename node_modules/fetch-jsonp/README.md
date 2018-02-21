# Fetch JSONP [![Build Status](https://travis-ci.org/camsong/fetch-jsonp.svg)](https://travis-ci.org/camsong/fetch-jsonp) [![npm version](https://badge.fury.io/js/fetch-jsonp.svg)](http://badge.fury.io/js/fetch-jsonp) [![npm downloads](https://img.shields.io/npm/dm/fetch-jsonp.svg?style=flat-square)](https://www.npmjs.com/package/fetch-jsonp)

JSONP is NOT supported in standard Fetch API, https://fetch.spec.whatwg.org.
fetch-jsonp provides you same API to fetch JSONP like native Fetch, also comes
with global `fetchJsonp` function.

If you need a `fetch` polyfill for old browsers, try [github/fetch](http://github.com/github/fetch).

## Installation

You can install with `npm`.

```
npm install fetch-jsonp
```

## Promise Polyfill for IE

IE8/9/10/11 does not support [ES6 Promise](https://tc39.github.io/ecma262/#sec-promise-constructor), run this to polyfill the global environment at the beginning of your application.

```js
require('es6-promise').polyfill();
```

## Usage

JSONP only supports GET method, same as `fetch-jsonp`.

### Fetch JSONP in simple way

```javascript
fetchJsonp('/users.jsonp')
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
```

### Set JSONP callback parameter name, default is 'callback'

```javascript
fetchJsonp('/users.jsonp', {
    jsonpCallback: 'custom_callback',
  })
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
```

### Set JSONP callback function name, default is a random number with `json_` prefix

```javascript
fetchJsonp('/users.jsonp', {
    jsonpCallbackFunction: 'function_name_of_jsonp_response'
  })
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
```

### Set JSONP request timeout, default is 5000ms

```javascript
fetchJsonp('/users.jsonp', {
    timeout: 3000,
  })
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
```

### Difference between `jsonpCallback` and `jsonCallbackFunction`
There two functions can easily be confused with each other, but there is a clear distinction.

Default values are
* `jsonpCallback`, default value is `callback`. It's the name of the callback parameter
* `jsonCallbackFunction`, default value is `null`. It's the name of the callback function. In order to make it distinct, it's a random string with `jsonp_` prefix like `jsonp_1497658186785_39551`. Leave it blank if it's set by the server, set it explicitly if the callback function name is fixed.

##### Case 1:
```js
fetchJsonp('/users.jsonp', {
  jsonpCallback: 'cb'
})
```
The request url will be `/users.jsonp?cb=jsonp_1497658186785_39551`, and the server should respond with a function like:
```js
jsonp_1497658186785_39551(
  { ...data here... }
)
```

##### Case 2:
```js
fetchJsonp('/users.jsonp', {
  jsonpCallbackFunction: 'search_results'
})
```
The request url will be `/users.jsonp?callback=search_results`, and the server should always respond with a function named `search_results` like:
```js
search_results(
  { ...data here... }
)
```

### Caveats

#### 1. You need to call `.then(function(response) { return response.json(); })` in order to keep consistent with Fetch API.

#### 2. `Uncaught SyntaxError: Unexpected token :` error

More than likely, you are calling a JSON api, which does not support JSONP. The difference is that JSON api responds with an object like `{"data": 123}` and will throw the error above when being executed as a function. On the other hand, JSONP will respond with a function wrapped object like `jsonp_123132({data: 123})`.

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_7-8/internet-explorer_7-8_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 8+ ✔ | Latest ✔ | 6.1+ ✔ |

# License

MIT

# Acknowledgement

Thanks to [github/fetch](https://github.com/github/fetch) for bring Fetch to old browsers.
