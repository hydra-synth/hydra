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
    - [color](#color)
    - [colorama](#colorama)
    - [invert](#invert)
    - [luma](#luma)
    - [thresh](#thresh)
- [Geometry](#geometry)
- [Global variables](#global-variables)
- [Modulators](#modulators)
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
- [color](#color)
- [colorama](#colorama)
- [invert](#invert)
- [luma](#luma)
- [thresh](#thresh)

### contrast

`.contrast( amount )`

* `amount` :: float (default `1.6`)

Larger `amount` value makes higher contrast.

### color

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

