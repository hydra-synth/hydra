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
