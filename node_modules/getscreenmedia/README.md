# getScreenMedia

## What is this?

A tiny browser module that gives us a simple API for getting access to a user's screen. It uses https://github.com/otalk/getUserMedia.

It gives us a cleaner node.js-style, error-first API and cross-browser handling. No browser support checking necessary; lack of support is treated in the same way as when the user rejects the request: the callback gets passed an error as the first argument.

Suitable for use with browserify/CommonJS on the client.

If you're not using browserify or you want AMD support use `getscreenmedia.bundle.js`. Note that if no module system is detected it will attach a function called `getScreenMedia` to `window`.


## Installing

```
npm install getscreenmedia
```

## How to use it

First build and install a domain-specific extension for [Chrome](https://github.com/otalk/getScreenMedia/tree/master/chrome-extension-sample) or/and [Firefox](https://github.com/otalk/getScreenMedia/tree/master/firefox-extension-sample).

Use the snippet below to get a screen stream, similar to [getUserMedia](https://github.com/otalk/getUserMedia).
```js
var getScreenMedia = require('getscreenmedia');

getScreenMedia(function (err, stream) {
    // if the browser doesn't support user media
    // or the user says "no" the error gets passed
    // as the first argument.
    if (err) {
       console.log('failed');
    } else {
       console.log('got a stream', stream);  
    }
});
```


## Why?

All supported browsers require the use of an extension and don't offer an cross-browser API which is annoying and error-prone. Node-style (error-first) APIs that are cross-browser, installable with npm and runnable on the client === win!

## Error handling

Error handling (denied requests, etc) are handled mostly by the underlying [getUserMedia lib](https://github.com/HenrikJoreteg/getUserMedia). However this adds one more error type:

- `"HTTPS_REQUIRED"`

Because that's a current requirement of Chrome.

See the [handling errors section of the getUserMedia lib](https://github.com/HenrikJoreteg/getUserMedia#handling-errors-summary) for details about how errors are handled.


## License

MIT
The Firefox sample extension is licensed under MPL 2.0

## Created By

If you like this, follow: [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.
