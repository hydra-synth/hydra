# Functions

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

* .hide()

### setBins

* .setBins( `int` )
    * `int` :: integer (default x)

### setCutoff

* .setCutoff( `frequency` )
    * `frequency` :: float (default x)

### setScale

* .setScale( `amount` )
    * `amount` :: float (default x) 

### setSmooth

* .setSmooth( `amount` )
    * `amount` :: float (default x)

### show

* .show()

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

* `amount` :: float (default 1.6)

Larger `amount` value makes higher contrast.

### color

`.color( r, g, b )`

* `r` :: float
* `g` :: float
* `b` :: float

Colorize texture.

### colorama

`.colorama( amount )`

* `amount` :: float (default 0.005)

Shift HSV values.

### invert

`.invert( amount )`

* `amount` :: float (default 1.0)

Invert color.

### luma

`.luma( threshold, tolerance )`

* `threshold` :: float (default 0.5)
* `tolerance` :: float (default 0.1)

### thresh

`.thresh( threshold, tolerance )`

* `threshold` :: float (default 0.5)
* `tolerance` :: float (default 0.04)
