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

### color `vec4`

`.color( r, g, b )`

* `r` :: float
* `g` :: float
* `b` :: float

Colorize texture.

### colorama

`.colorama( amount )`

* `amount` :: float (default `0.005`)

Shift HSV values.

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

### pixelate

`.pixelate( x, y )`

* `pixelX` :: float (default `20.0`)
* `pixelY` :: float (default `20.0`)

Pixelate texture with `pixelX` segments and `pixelY` segments.

### rotate

`.rotate( angle, speed )`

* `angle` :: float (default `10.0`)
* `speed` :: float (default `0.0`)

Rotate texture.

### scale

`.scale( size, xMult, yMult )`

* `size` :: float (default `x`)
* `xMult` :: float (default `1.0`)
* `yMult` :: float (default `1.0`)

Scale texture.

### scrollX

`.scrollX( scrollX, speed )`

* `scrollX` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

### scrollY

`.scrollY( scrollY, speed )`

* `scrollY` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

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

### modulateHue

`.modulateHue( color, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `1.0`)

Changes coordinates based on hue of second input. 
Based on:https://www.shadertoy.com/view/XtcSWM

### modulateKaleid

`.modulateKaleid( nSides )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `nSides` :: float (default `4.0`)

See also: [`kaleid`](#kaleid).

### modulatePixelate

`.modulatePixelate( multiple, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `10.0`)
* `offset` :: float (default `3.0`)

See also: [`pixelate`](#pixelate)

### modulateRotate

`.modulateRotate( multiple, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `1.0`)
* `offset` :: float (default `0.0`)

See also: [`rotate`](#rotate)

### modulateScale

`.modulateScale( multiple, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `1.0`)
* `offset` :: float (default `1.0`)

See also: [`scale`](#scale)

### modulateScrollX

`.modulateScrollX( multiple, scrollX, speed )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `scrollX` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

See also: [`scrollX`](#scrollx)

### modulateScrollY

`.modulateScrollY( multiple, scrollX, speed )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `scrollY` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

See also: [`scrollY`](#scrollY)

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

### blend

`.blend( texture, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `0.5`)

Blend textures.

### diff

`.diff( texture )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)

Return difference of textures.

### layer

`.layer( texture )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)

Overlay texture based on alpha value.

### mult

`.mult( texture, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `1.0`)

Multiply images and blend with the texture by `amount`.

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

### noise

`noise( scale, offset )`

* `scale` :: int (default `10.0`)
* `offset` :: float (default `0.1`)

Generate [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise).

### osc

`osc( frequency, sync, offset )`

* `frequency` :: float (default `60.0`)
* `sync` :: float (default `0.1`)
* `offset` :: float (default `0.0`)

### out

`.out( buffer )`

* `buffer`
  * `osc`: `o0`, `o1`, `o2`, `o3`
  * `src`: `s0`, `s1`, `s2`, `s3`

### render

`render( buffer )`

* `buffer`: buffer (default `o0`)

### shape

`shape( sides, radius, smoothing)`

* `sides` :: int (default `3.0`)
* `radius` :: float (default `0.3`)
* `smoothing` :: float (default `0.01`)

### solid

`solid( r, g, b, a )`

* `r` :: float (default `0.0`)
* `g` :: float (default `0.0`)
* `b` :: float (default `0.0`)
* `a` :: float (default `1.0`)

### src

`src( input )`

* `input` :: input (examples: `o0`, `s1`)

### voronoi

`voronoi( scale, speed, blending )`

* `scale` :: float (default `5`)
* `speed` :: float (default `0.3`)
* `blending` :: float (default `0.3`)

Generate [voronoi shapes](https://en.wikipedia.org/wiki/Voronoi_diagram).

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
