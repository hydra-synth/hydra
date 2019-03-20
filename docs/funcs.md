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
- [Sources](#sources)
- [Parameter sequences](#parameter-sequences)

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
osc( ({time}) => Math.sin(time) )
.out(o0)
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
  * `color` :: `vec4`, see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `0.1`)

Modulate texture. 
More about modulation at: https://lumen-app.com/guide/modulation/

### modulateHue

`.modulateHue( color, amount )`

* `texture`
  * `color` :: `vec4`, see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `1.0`)

Changes coordinates based on hue of second input. 
Based on:https://www.shadertoy.com/view/XtcSWM

### modulateKaleid

`.modulateKaleid( nSides )`

* `texture`
  * `color` :: `vec4`, see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `nSides` :: float (default `4.0`)

See also: [`kaleid`](#kaleid).

### modulatePixelate

`.modulatePixelate( multiple, offset )`

* `texture`
  * `color` :: `vec4`, see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `10.0`)
* `offset` :: float (default `3.0`)

See also: [`pixelate`](#pixelate)

### modulateRotate

`.modulateRotate( multiple, offset )`

* `texture`
  * `color` :: `vec4`, see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `1.0`)
* `offset` :: float (default `0.0`)

See also: [`rotate`](#rotate)

### modulateScale

`.modulateScale( multiple, offset )`

* `texture`
  * `color` :: `vec4`, see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `1.0`)
* `offset` :: float (default `1.0`)

See also: [`scale`](#scale)

### modulateScrollX

`.modulateScrollX( multiple, scrollX, speed )`

* `texture`
  * `color` :: `vec4`, see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `scrollX` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

See also: [`scrollX`](#scrollx)

### modulateScrollY

`.modulateScrollY( multiple, scrollX, speed )`

* `texture`
  * `color` :: `vec4`, see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `scrollY` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

See also: [`scrollY`](#scrollY)


---