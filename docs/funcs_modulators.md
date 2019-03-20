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
  * `src` :: see [Sources](#sources)
  * `shape` :: see [Sources](#sources)
* `amount` :: float (default `0.1`)

Modulate texture. More about modulation at: <https://lumen-app.com/guide/modulation/>

### modulateHue

`.modulateHue( `color`, `amount` )`

* texture
  * color :: vec4
  * src
  * shape
* amount :: float (default 1.0)

Changes coordinates based on hue of second input. Based on: <https://www.shadertoy.com/view/XtcSWM>

### modulateKaleid

`.modulateKaleid( `nSides` )`

* texture
  * color :: vec4
  * src
  * shape
* nSides :: float (default 4.0)

### modulatePixelate

`.modulatePixelate( `multiple`, `offset` )`

* texture
  * color :: vec4
  * src
  * shape
* multiple :: float (default 10.0)
* offset :: float (default 3.0)

### modulateRotate

`.modulateRotate( `multiple`, `offset` )`

* texture
  * color :: vec4
  * src
  * shape
* multiple :: float (default 1.0)
* offset :: float (default 0.0)

### modulateScale

`.modulateScale( `multiple`, `offset` )`

* texture
  * color :: vec4
  * src
  * shape
* multiple :: float (default 1.0)
* offset :: float (default 1.0)

### modulateScrollX

`.modulateScrollX( `multiple`, `scrollX`, `speed` )`

* texture
  * color :: vec4
  * src
  * shape
* scrollX :: float (default 0.5)
* speed :: float (default 0.0)

### modulateScrollY

`.modulateScrollY( `multiple`, `scrollY`, `speed` )`

* texture
  * color :: vec4
  * src
  * shape
* scrollY :: float (default 0.5)
* speed :: float (default 0.0)