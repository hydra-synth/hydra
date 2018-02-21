# raf-loop

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A minimal requestAnimationFrame render loop for node and the browser, using high-performance timing where possible.

```js
var loop = require('raf-loop')

var engine = loop(function(dt) {
    // delta time in milliseconds 
}).start()
```

## Usage

[![NPM](https://nodei.co/npm/raf-loop.png)](https://nodei.co/npm/raf-loop/)

#### `engine = loop([fn])`

Creates a new loop with an optional function to receive tick events. The function will be called with delta time as the first parameter, in milliseconds.

#### `engine.start()`

Starts the render loop and returns this engine, for chaining.

#### `engine.stop()`

Stops the render loop and cancels the currently requested animation frame.

#### `engine.on('tick', fn)`

Attaches another function to the render loop.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/raf-loop/blob/master/LICENSE.md) for details.
