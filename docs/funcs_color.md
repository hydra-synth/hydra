## Color

Functions for manipulating color.

- [brightness](#brightness)
- [contrast](#contrast)
- [color `vec4`](#color-vec4)
- [colorama](#colorama)
- [invert](#invert)
- [luma](#luma)
- [posterize](#posterize)
- [saturate](#saturate)
- [shift](#shift)
- [thresh](#thresh)

### brightness

`.brightness( amount )`

* `amount` :: float (default `0.4`)

#### Example

```javascript
osc(20,0,2)
  .brightness( ({time}) => Math.sin(time) )
  .out(o0)
```

### contrast

`.contrast( amount )`

* `amount` :: float (default `1.6`)

Larger `amount` value makes higher contrast.

#### Example

```javascript
// 20Hz oscillator with contrast interpolating between 0.0-5.0
osc(20).contrast( ({time}) => Math.sin(time) * 5 ).out(o0)
```

### color `vec4`

`.color( r, g, b )`

* `r` :: float
* `g` :: float
* `b` :: float

Colorize texture.

#### Example

```javascript
// 20Hz oscillator source
// color sequence of Red, Green, Blue, White, Black
// output to buffer o0
osc(20).color([1,0,0,1,0],[0,1,0,1,0],[0,0,1,1,0]).out(o0)
```

### colorama

`.colorama( amount )`

* `amount` :: float (default `0.005`)

Shift HSV values.

#### Example

```javascript
// 20Hz oscillator source
// color sequence of Red, Green, Blue, White, Black
// colorama sequence of 0.005, 0.5, 1.0 at 1/8 speed
// output to buffer o0
osc(20)
  .color([1,0,0,1,0],[0,1,0,1,0],[0,0,1,1,0])
  .colorama([0.005,0.33,0.66,1.0].fast(0.125))
  .out(o0)
```

```javascript
// 
noise(3,0.1).colorama( ({time}) => Math.sin(time/5) ).out(o0)
```

### invert

`.invert( amount )`

* `amount` :: float (default `1.0`)

Invert color.

#### Example

```javascript
solid(1,1,1).invert([0,1]).out(o0)
```

### luma

`.luma( threshold, tolerance )`

* `threshold` :: float (default `0.5`)
* `tolerance` :: float (default `0.1`)

#### Example

```javascript
// default
osc(10,0,1).luma(0.5,0.1).out(o0)

osc(10,0,[0,0.5,1,2]).luma([0.1,0.25,0.75,1].fast(0.25),0.1).out(o0)
```

### posterize

`.posterize( bins, gamma )`

* `bins` :: float (default `3.0`)
* `gamma` :: float (default `0.6`)

#### Example

```javascript
// static gradient posterized, varying bins
gradient(0).posterize( [1, 5, 15, 30] , 0.5 ).out(o0)

// static gradient posterized, varying gamma
gradient(0).posterize( 3, [0.1, 0.5, 1.0, 2.0] ).out(o0)
```

### saturate

`.saturate( amount )`

* `amount` :: float (default `2.0`)

#### Example

```javascript
osc(10,0,1).saturate( ({time}) => Math.sin(time) * 10 ).out()
```

### shift

`.shift( r, g, b, a )`

* `r` :: float (default `0.5`)
* `g` :: float (default `0.5`)
* `b` :: float (default `0.5`)
* `a` :: float (default `0.5`)

#### Example

```javascript

```

### thresh

`.thresh( threshold, tolerance )`

* `threshold` :: float (default `0.5`)
* `tolerance` :: float (default `0.04`)

#### Example

```javascript
// default
noise(3,0.1).thresh(0.5,0.04).out(o0)

noise(3,0.1)
  .thresh( ({time})=>Math.sin(time/2) , [0.04,0.25,0.75,1].fast(0.25) )
  .out(o0)
```
