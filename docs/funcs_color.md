# Color

Functions for manipulating color.

- [contrast](#contrast)
- [color](#color)
- [colorama](#colorama)
- [invert](#invert)
- [luma](#luma)
- [thresh](#thresh)

---

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
