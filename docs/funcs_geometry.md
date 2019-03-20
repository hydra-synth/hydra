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
