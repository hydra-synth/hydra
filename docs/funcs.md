# Functions

- [Categories of functions](#categories)
- [Complete contents of functions](#contents)

## Categories

- [Audio](#audio)
- [Color](#color)
- [Geometry](#geometry)
- [Global variables](#global-variables)
- [Modulators](#modulators)
- [Operators](#operators)
- [Sources](#sources)
- [Parameter sequences](#parameter-sequences)

## Contents

- [Audio](#audio)
    - [hide](#hide)
    - [setBins](#setbins)
    - [setCutoff](#setcutoff)
    - [setScale](#setScale)
    - [setSmooth](#setSmooth)
    - [show](#show)
- [Color](#color)
    - [contrast](#contrast)
    - [color `vec4`](#color-vec4)
    - [colorama](#colorama)
    - [invert](#invert)
    - [luma](#luma)
    - [thresh](#thresh)
- [Geometry](#geometry)
    - [kaleid](#kaleid)
    - [pixelate](#pixelate)
    - [rotate](#rotate)
    - [scale](#scale)
    - [scrollX](#scrollX)
    - [scrollY](#scrollY)
- [Global variables](#global-variables)
    - [mouse](#mouse)
    - [time](#time)
- [Modulators](#modulators)
    - [modulate](#modulate)
    - [modulateHue](#modulateHue)
    - [modulateKaleid](#modulateKaleid)
    - [modulatePixelate](#modulatePixelate)
    - [modulateRotate](#modulateRotate)
    - [modulateScale](#modulateScale)
    - [modulateScrollX](#modulateScrollX)
    - [modulateScrollY](#modulateScrollY)
- [Operators](#operators)
  - [add](#add)
  - [blend](#blend)
  - [diff](#diff)
  - [layer](#layer)
  - [mult](#mult)
- [Sources](#sources)
  - [gradient](#gradient)
  - [noise](#noise)
  - [osc](#osc)
  - [out](#out)
  - [render](#render)
  - [shape](#shape)
  - [solid](#solid)
  - [src](#src)
  - [voronoi](#voronoi)
- [Parameter sequences](#parameter-sequences)
  - [Lists as parameter sequences](#lists-as-parameter-sequences)
  - [Functions on parameter sequences](#functions-on-parameter-sequences)
      - [fast](#fast)

---

## Audio

Functions for manipulating audio signals.

- [hide](#hide)
- [setBins](#setbins)
- [setCutoff](#setcutoff)
- [setScale](#setScale)
- [setSmooth](#setSmooth)
- [show](#show)

### hide

`.hide()`

### setBins

`.setBins( bins )`

* `bins` :: integer (default `x`)

### setCutoff

`.setCutoff( frequency )`

* `frequency` :: float (default `x`)

### setScale

`.setScale( amount )`

* `amount` :: float (default `x`) 

### setSmooth

`.setSmooth( amount )`

* `amount` :: float (default `x`)

### show

`.show()`

---

## Color

Functions for manipulating color.

- [contrast](#contrast)
- [color `vec4`](#color-vec4)
- [colorama](#colorama)
- [invert](#invert)
- [luma](#luma)
- [thresh](#thresh)

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

### luma

`.luma( threshold, tolerance )`

* `threshold` :: float (default `0.5`)
* `tolerance` :: float (default `0.1`)

### thresh

`.thresh( threshold, tolerance )`

* `threshold` :: float (default `0.5`)
* `tolerance` :: float (default `0.04`)

---

## Geometry

Functions for manipulating geometry.

- [kaleid](#kaleid)
- [pixelate](#pixelate)
- [rotate](#rotate)
- [scale](#scale)
- [scrollX](#scrollX)
- [scrollY](#scrollY)

### kaleid

`.kaleid( nSides )`

* `nSides` :: float (default `4.0`)

Kaleidoscope effect with `nSides` repetition.

#### Example

```javascript
osc(25,-0.1,0.5).kaleid(50).out(o0)
```

### pixelate

`.pixelate( x, y )`

* `pixelX` :: float (default `20.0`)
* `pixelY` :: float (default `20.0`)

Pixelate texture with `pixelX` segments and `pixelY` segments.

#### Example

```javascript

```

### rotate

`.rotate( angle, speed )`

* `angle` :: float (default `10.0`)
* `speed` :: float (default `0.0`)

Rotate texture.

#### Example

```javascript

```

### scale

`.scale( size, xMult, yMult )`

* `size` :: float (default `x`)
* `xMult` :: float (default `1.0`)
* `yMult` :: float (default `1.0`)

Scale texture.

#### Example

```javascript

```

### scrollX

`.scrollX( scrollX, speed )`

* `scrollX` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

#### Example

```javascript

```

### scrollY

`.scrollY( scrollY, speed )`

* `scrollY` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

#### Example

```javascript

```

---

## Global variables

Useful variables that are defined globally, and can be used within functions as a parameter.

- [mouse](#mouse)
- [time](#time)

### mouse

`mouse`

* `.x` :: x position of mouse
* `.y` :: y position of mouse

#### Example

Control the oscillator frequency with the mouse position:

```javascript
osc(() => mouse.x).out(o0)
```

### time

`time`

* `time` :: the current time

#### Example

Control the oscillator using a sine wave based on the current time:

```javascript
osc( ({time}) => Math.sin(time) ).out(o0)
```

---

## Modulators

Functions for describing modulations of sources. 

- [modulate](#modulate)
- [modulateHue](#modulateHue)
- [modulateKaleid](#modulateKaleid)
- [modulatePixelate](#modulatePixelate)
- [modulateRotate](#modulateRotate)
- [modulateScale](#modulateScale)
- [modulateScrollX](#modulateScrollX)
- [modulateScrollY](#modulateScrollY)

### modulate

`.modulate( texture, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `0.1`)

Modulate texture. 
More about modulation at: https://lumen-app.com/guide/modulation/

#### Example

```javascript
// chocolate whirlpool
voronoi()
  .color(0.9,0.25,0.15)
  .rotate(({time})=>(time%360)/2)
  .modulate(osc(25,0.1,0.5)
            .kaleid(50)
            .scale(({time})=>Math.sin(time*1)*0.5+1)
            .modulate(noise(0.6,0.5)),
            0.5)
  .out(o0)
```

### modulateHue

`.modulateHue( color, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `1.0`)

Changes coordinates based on hue of second input. 
Based on:https://www.shadertoy.com/view/XtcSWM

#### Example

```javascript

```

### modulateKaleid

`.modulateKaleid( nSides )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `nSides` :: float (default `4.0`)

See also: [`kaleid`](#kaleid).

#### Example

```javascript
osc(9,-0.1,0.1)
  .modulateKaleid(osc(11,0.5,0),50)
  .scale(0.1,0.3)
  .modulate(noise(5,0.1))
  .mult(solid(1,1,0.3))
  .out(o0)
```

### modulatePixelate

`.modulatePixelate( multiple, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `10.0`)
* `offset` :: float (default `3.0`)

See also: [`pixelate`](#pixelate)

#### Example

```javascript
// what lies beneath
voronoi(10,1,5).brightness(()=>Math.random()*0.15)
  .modulatePixelate(noise(25,0.5),100)
  .out(o0)
```

### modulateRotate

`.modulateRotate( texture, multiple, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `1.0`)
* `offset` :: float (default `0.0`)

See also: [`rotate`](#rotate)

#### Example

```javascript
// wormhole
voronoi(100,3,5)
  .modulateRotate(osc(1,0.5,0).kaleid(50).scale(0.5),15,0)
  .mult(osc(50,-0.1,8).kaleid(9))
  .out(o0)
```

### modulateScale

`.modulateScale( multiple, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `1.0`)
* `offset` :: float (default `1.0`)

See also: [`scale`](#scale)

#### Example

```javascript
// cosmic radiation
gradient(5).repeat(50,50).kaleid([3,5,7,9].fast(0.5))
  .modulateScale(osc(4,-0.5,0).kaleid(50).scale(0.5),15,0)
  .out(o0)
```

### modulateScrollX

`.modulateScrollX( multiple, scrollX, speed )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `scrollX` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

See also: [`scrollX`](#scrollx)

#### Example

```javascript

```

### modulateScrollY

`.modulateScrollY( multiple, scrollX, speed )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `scrollY` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

See also: [`scrollY`](#scrollY)

#### Example

```javascript

```

---

## Operators

Functions for performing operations on sources.

- [add](#add)
- [blend](#blend)
- [diff](#diff)
- [layer](#layer)
- [mult](#mult)

### add

`.add( texture, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `0.5`)

Add textures.

#### Example

```javascript
shape().scale(0.5).add(shape(4),[0,0.25,0.5,0.75,1]).out()

osc(9,0.1,1).add(osc(13,0.5,5)).out()
```

### blend

`.blend( texture, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `0.5`)

Blend textures.

#### Example

```javascript
shape().scale(0.5).blend(shape(4),[0,0.25,0.5,0.75,1]).out()

osc(9,0.1,1).blend(osc(13,0.5,5)).out()
```

### diff

`.diff( texture )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)

Return difference of textures.

#### Example

```javascript
osc(9,0.1,1).diff(osc(13,0.5,5)).out()

osc(1,1,2)
  .diff(shape(6,1.1,0.01)
        .scale(({time})=>Math.sin(time)*0.05 + 0.9)
        .kaleid(15)
        .rotate(({time})=>time%360))
  .out()
```

### layer

`.layer( texture )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)

Overlay texture based on alpha value.

#### Example

```javascript
solid(1,0,0,1).layer(shape(4).color(0,1,0,({time})=>Math.sin(time*2))).out()
```

### mult

`.mult( texture, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `1.0`)

Multiply images and blend with the texture by `amount`.

#### Example

```javascript
osc(9,0.1,2).mult(osc(13,0.5,5)).out()
```

---

## Sources

Sources are elementary generators that output different types of visual content.

- [gradient](#gradient)
- [noise](#noise)
- [osc](#osc)
- [out](#out)
- [render](#render)
- [shape](#shape)
- [solid](#solid)
- [src](#src)
- [voronoi](#voronoi)

### gradient

`gradient( speed )`

* `speed` :: float (default `x`)

#### Example

```javascript
// gradient sequence at speeds of 1, 2 & 4
gradient([1,2,4]).out(o0)
```

### noise

`noise( scale, offset )`

* `scale` :: int (default `10.0`)
* `offset` :: float (default `0.1`)

Generate [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise).

#### Example

```javascript
// noise interpolating between different scales and offsets
noise( ({time}) => Math.sin(time/10)*50 , ({time}) => Math.sin(time/2)/500 )
    .out(o0)
```

### osc

`osc( frequency, sync, offset )`

* `frequency` :: float (default `60.0`)
* `sync` :: float (default `0.1`)
* `offset` :: float (default `0.0`)

#### Example

```javascript
// frequency
osc( [1,10,50,100,250,500].fast(2) ).out(o0)

// frequency 2
osc( ({time}) => Math.sin(time/10) * 100 ).out(o0)

// sync
osc( 10, [-10,-1,-0.1,0,0.1,1,10], 0 ).out(o0)

// offset
osc(10,0.1, ({time}) => Math.sin(time/10) * 100 ).out(o0)
```

### out

`.out( buffer )`

* `buffer`
  * `osc`: `o0`, `o1`, `o2`, `o3`
  * `src`: `s0`, `s1`, `s2`, `s3`

#### Example

```javascript
// output four oscillators to different buffers
// and then modulate them together
osc( [1,10,50,100,250,500].fast(2) ).out(o0) // frequency
osc( ({time}) => Math.sin(time/10) * 100 ).out(o1) // frequency 2
osc( 10, [-10,-1,-0.1,0,0.1,1,10], 0 ).out(o2) // sync
osc(10,0.1, ({time}) => Math.sin(time/10) * 100 ) // offset
  .modulate(o1,0.05)
  .modulate(o2,0.05)
  .modulate(o3,0.05)
  .out(o3)
render(o3)
```

### render

`render( buffer )`

* `buffer`: buffer (default `o0`)

#### Example

```javascript
osc( [1,10,50,100,250,500].fast(2) ).out(o0) // frequency
osc( ({time}) => Math.sin(time/10) * 100 ).out(o1) // frequency 2
osc( 10, [-10,-1,-0.1,0,0.1,1,10], 0 ).out(o2) // sync
osc(10,0.1, ({time}) => Math.sin(time/10) * 100 ).out(o3) // offset

render(o0) // change to o1, o2, or o3
```

```javascript
// see all four buffers at once
osc( [1,10,50,100,250,500].fast(2) ).out(o0) // frequency
osc( ({time}) => Math.sin(time/10) * 100 ).out(o1) // frequency 2
osc( 10, [-10,-1,-0.1,0,0.1,1,10], 0 ).out(o2) // sync
osc(10,0.1, ({time}) => Math.sin(time/10) * 100 ).out(o3) // offset
render()
```

### shape

`shape( sides, radius, smoothing)`

* `sides` :: int (default `3.0`)
* `radius` :: float (default `0.3`)
* `smoothing` :: float (default `0.01`)

#### Example

```javascript
// inverting blurry circle
shape(100,0.01,1).invert(({time})=>Math.sin(time)*2).out(o0)

// a... rainbow ball?
shape(5,0.5,0.1).repeat(19,19)
  .mult(osc(10,1,2))
  .rotate( ({time}) => time%360 )
  .scrollX(1,-0.25)
  .mult(shape(15,0.3,0.01)
        .rotate( ({time}) => time%360 )
        .scrollX(1,-0.25))
  .out(o0)
```

### solid

`solid( r, g, b, a )`

* `r` :: float (default `0.0`)
* `g` :: float (default `0.0`)
* `b` :: float (default `0.0`)
* `a` :: float (default `1.0`)

#### Example

```javascript
// cycling through red, green and blue
solid([1,0,0],[0,1,0],[0,0,1],1).out(o0)
```

### src

`src( input )`

* `input` :: input (examples: `o0`, `s1`)

See `hydra-examples` repository

### voronoi

`voronoi( scale, speed, blending )`

* `scale` :: float (default `5`)
* `speed` :: float (default `0.3`)
* `blending` :: float (default `0.3`)

Generate [voronoi shapes](https://en.wikipedia.org/wiki/Voronoi_diagram).

#### Example

```javascript
// default
voronoi(5,0.3,0.3).out(o0)

// fireflies
voronoi(25,2,10).color(1,1,0).brightness(0.15).out(o0)
```

---

## Parameter sequences

- [Lists as parameter sequences](#lists-as-parameter-sequences)
- [Functions on parameter sequences](#functions-on-parameter-sequences)
    - [fast](#fast)

### Lists as parameter sequences

```
osc(
   [80, 100, 200, 50], 1 )
)
.out(o0)
```

### Functions on parameter sequences

#### fast

`fast ( amount) `

* `amount` :: float (default `x`)

```
osc(
   [80, 100, 200, 50].fast(0.2), 1 )
)
.out(o0)
```
