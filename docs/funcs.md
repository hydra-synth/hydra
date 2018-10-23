# Functions

## Color

### .contrast(`amount`)
* amount :: float (default 1.6)

Larger `amount` value makes higher contrast.

### .color( `r`, `g`, `b` )
* r :: float
* g :: float
* b :: float

Colorize texture.

### .colorama(`amount`)
* amount :: float (default 0.005)

Shift HSV values.

### .invert(`amount`)
* amount :: float (default 1.0)

Invert color.

### .luma( `threshold`, `tolerance` )
* threshold :: float (default 0.5)
* tolerance :: float (default 0.1)

### .thresh( `threshold`, `tolerance` )
* threshold :: float (default 0.5)
* tolerance :: float (default 0.04)

-----------

## Combine

### .add( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float (default 0.5)

Add textures.

### .blend( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float (default 0.5)

Blend textures.

### .diff( `texture` )
* texture
  * color :: vec4
  * src
  * shape

Return difference of textures.

### .layer()

Overlay texture based on alpha value.

### .mult( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float (default 1.0)

Multiply images and blend with the texture by `amount`.

-----------------

## CombineCoord

### .modulate( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float (default 0.1)

Modulate texture. More about modulation at: <https://lumen-app.com/guide/modulation/>

### .modulateHue( `color`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float (default 1.0)

Changes coordinates based on hue of second input. Based on: <https://www.shadertoy.com/view/XtcSWM>

### .modulateKaleid( `nSides` )
* texture
  * color :: vec4
  * src
  * shape
* nSides :: float (default 4.0)

### .modulatePixelate( `multiple`, `offset` )
* texture
  * color :: vec4
  * src
  * shape
* multiple :: float (default 10.0)
* offset :: float (default 3.0)

### .modulateRotate( `multiple`, `offset` )
* texture
  * color :: vec4
  * src
  * shape
* multiple :: float (default 1.0)
* offset :: float (default 0.0)

### .modulateScale( `multiple`, `offset` )
* texture
  * color :: vec4
  * src
  * shape
* multiple :: float (default 1.0)
* offset :: float (default 1.0)

### .modulateScrollX( `multiple`, `scrollX`, `speed` )
* texture
  * color :: vec4
  * src
  * shape
* scrollX :: float (default 0.5)
* speed :: float (default 0.0)

### .modulateScrollY( `multiple`, `scrollY`, `speed` )
* texture
  * color :: vec4
  * src
  * shape
* scrollY :: float (default 0.5)
* speed :: float (default 0.0)

-----------------

## Coord

### .kaleid( `nSides`)
* nSides :: float (default 4.0)

Kaleidoscope effect with `nSides` repetition.

### .rotate( `angle`, `speed` )
* angle :: float (default 10.0)
* speed :: float (default 0.0)

Rotate texture.

### .scale( `size`, `xMult`, `yMult` )
* size :: float
* xMult :: float (default 1.0)
* yMult :: float (default 1.0)

Scale texture.

### .pixelate( `x`, `y` )
* pixelX :: float (default 20.0)
* pixelY :: float (default 20.0)

Pixelate texture with `pixelX` segments and `pixelY` segments.

### .scrollX( `scrollX`, `speed` )
* scrollX :: float (default 0.5)
* speed :: float (default 0.0)

### .scrollY( `scrollY`, `speed` )
* scrollY :: float (default 0.5)
* speed :: float (default 0.0)

-------------------------

## Src

### osc( `frequency`, `sync`, `offset` )
* frequency :: float (default 60.0)
* sync :: float (default 0.1)
* offset :: float (default 0.0)

### render( `output buffer`)
* default: `o0`

### shape( `sides`, `radius`, `smoothing`)
* sides :: int (default 3.0)
* radius :: float (default 60.0)
* smoothing :: float (default 0.01)

### solid( `r`, `g`, `b`, `a`)
* r :: float (default 0.0)
* g :: float (default 0.0)
* b :: float (default 0.0)
* a :: float (default 1.0)

### gradient( `speed` )
* speed :: float

### src( `input` )
* input :: examples: `o0`, `s1`

### noise( `scale`, `offset` )
* scale :: int (default 10.0)
* offset :: float (default 0.1)

Generate Perlin noise.

### .out( `output buffer` )
* output buffer
  * osc: `o0`, `o1`, `o2`, `o3`
  * src: `s0`, `s1`, `s2`, `s3`

-------------------

## Sequences of parameters

```
osc(
   [80, 100, 200, 50], 1 )
)
.out(o0)
```

```
osc(
   [80, 100, 200, 50].fast(0.2), 1 )
)
.out(o0)
```
-------------------

## Audio

### .hide()

### .setBins( `int` )

### .setCutoff( `float` )

### .setScale( `float` )

### .setSmooth( `float` )

### .show()

-------------------

## Global variables

Some useful variables that are defined globally, and can be used within functions as a parameter.

### time
Example:
```
osc(
  ({time}) => Math.sin(time)
)
.out(o0)
```

### mouse
* .x :: x position of mouse
* .y :: y position of mouse

Control the oscillator frequency with the mouse position:
```
osc(() => mouse.x).out(o0)
```
