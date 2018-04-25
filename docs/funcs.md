# Functions

## Color

### .contrast()

No Args

### .color( `r`, `g`, `b` )
* r :: float
* g :: float
* b :: float

### .colorama()

No Args

### .invert()

No Args

### .luma( `threshold`, `tolerance` )
* threshold :: float
* tolerance :: float

### .thresh( `threshold`, `tolerance` )
* threshold :: float
* tolerance :: float

-----------

## Combine

### .add( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float

### .blend( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float

### .diff( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float

### .layer()

No Args

### .mult( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float

-----------------

## CombineCoord

### .modulate( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float

### .modulateHue( `color`, `amount` )
* color :: vec4
* amount :: float

-----------------

## Coord

### .kaleid()

No Args

### .rotate( `angle`, `speed` )
* angle :: float
* speed :: float

### .scale( `size` )
* size :: float

### .pixelate( `x`, `y` )
* pixelX :: float
* pixelY :: float

### scrollX.( `scrollX`, `speed` )
* scrollX :: float
* speed :: float

### .scrollY( `scrollY`, `speed` )
* scrollY :: float
* speed :: float

-------------------------

## Src

### osc( `frequency`, `sync`, `offset` )
* frequency :: float
* sync :: float
* offset :: float

### render( `output buffer`)
* default: `o0`

### shape( `sides`, `scale`, `blur`)
* sides :: int
* scale :: float
* blur :: float

### solid( `r`, `g`, `b`, `a`)
* r :: float
* g :: float
* b :: float
* a :: float

### src( `input` )
* input :: examples: `o0`, `s1`

### .noise()

No Args

### .out( `output buffer` )
* output buffer
  * osc: `o0`, `o1`, `o2`, `o3`
  * src: `s0`, `s1`, `s2`, `s3`

-------------------

## Animate

### seq( `array[]`, `speed` )

#### note: should be defined at top of file
```
seq = (arr = [], speed = 1) => ({time}) => (   
  arr[ Math.floor( time * speed % (arr.length) ) ]
)
```

#### example

```
osc(
  seq( [80, 100, 200, 50], 1 )
)
.out(o0)
```

-------------------

## Audio

### .hide()

### .setBins( `int` )

### .setCutoff( `float` )

### .setMax( `float` )

### .show()

-------------------

## Util

### random()

No Args

### _noise()

No Args

### luminance()

No Args

### rgbToHsv()

No Args

### hsvToRgb()

No Args
