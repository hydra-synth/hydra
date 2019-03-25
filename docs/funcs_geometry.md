## Geometry

Functions for manipulating geometry.

- [kaleid](#kaleid)
- [pixelate](#pixelate)
- [repeat](#repeat)
- [repeatX](#repeatX)
- [repeatY](#repeatY)
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
// default
noise().pixelate(20,20).out(o0)

noise()
  .mult(osc(10,0.25,1))
  .scrollY(1,0.25)
  .pixelate([100,40,20,70].fast(0.25))
  .modulateRotate(src(o0).scale(0.5),0.125)
  .diff(src(o0).rotate([-0.05,0.05].fast(0.125)))
  .out(o0)
```

### repeat

`.repeat( repeatX, repeatY, offsetX, offsetY )`

* `repeatX` :: float (default `3.0`)
* `repeatY` :: float (default `3.0`)
* `offsetX` :: float (default `0.0`)
* `offsetY` :: float (default `0.0`)

#### Example

```javascript
// default
shape().repeat(3.0, 3.0, 0.0, 0.0).out()

// dogtooth factory
shape(1.25,0.5,0.25)
  .repeat(3, 3)
  .scale(2)
  .repeat(5, 5, ({time}) => Math.sin(time), ({time}) => Math.sin(time/2))
  .out(o0)
```

### repeatX

`.repeatX( reps, offset )`

* `reps` :: float (default `3.0`)
* `offset` :: float (default `0.0`)

#### Example

```javascript
// default
shape().repeatX(3.0, 0.0).out()

osc(5,0,1)
  .rotate(1.57)
  .repeatX([1,2,5,10], ({time}) => Math.sin(time))
  .out()
```

### repeatY

`.repeatY( reps, offset )`

* `reps` :: float (default `3.0`)
* `offset` :: float (default `0.0`)

#### Example

```javascript
// default
shape().repeatY(3.0, 0.0).out()

osc(5,0,1)
  .repeatY([1,2,5,10], ({time}) => Math.sin(time))
  .out()
```

### rotate

`.rotate( angle, speed )`

* `angle` :: float (default `10.0`)
* `speed` :: float (default `0.0`)

Rotate texture.

#### Example

```javascript
osc(50).rotate( ({time}) => time%360 ).out(o0)

osc(10,1,1)
    .rotate( ({time}) => time%360, ({time}) => Math.sin(time*0.1)*0.05 )
    .out(o0)
```

### scale

`.scale( size, xMult, yMult )`

* `size` :: float (default `1.5`)
* `xMult` :: float (default `1.0`)
* `yMult` :: float (default `1.0`)

Scale texture.

#### Example

```javascript
// default
shape().scale(1.5,1,1).out()

shape().scale(1.5,[0.25,0.5,0.75,1].fast(0.25),[3,2,1])
  .invert([0,1].fast(0.25))
  .kaleid(5)
  .kaleid(12)
  .scale( ({time})=>Math.sin(time/5)*0.5 )
  .rotate(1,1)
  .out(o0)
```

### scrollX

`.scrollX( scrollX, speed )`

* `scrollX` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

#### Example

```javascript
// default
osc(10,0,1).scrollX(0.5,0).out()

// x position
osc(10,0,1).scrollX([0,0.25,0.5,0.75,1].fast(4),0).out()

// scroll speed
gradient(1).scrollX(0, ({time}) => Math.sin(time*0.05)*0.05 ).out()

gradient(0.125)
  .scrollX(0, ({time}) => Math.sin(time*0.05)*0.05 )
  .scrollY(0, ({time}) => Math.sin(time*0.01)*-0.07 )
  .pixelate([5,2,10],[15,8])
  .scale(0.15)
  .modulate(noise(1,0.25))
  .out()
```

### scrollY

`.scrollY( scrollY, speed )`

* `scrollY` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

#### Example

```javascript
// default
osc(10,0,1).scrollY(0.5,0).out()

// y position
osc(10,0,1).scrollY([0,0.25,0.5,0.75,1].fast(4),0).out()

// scroll speed
gradient(1).scrollY(0, ({time}) => Math.sin(time*0.05)*0.05 ).out()

gradient(0.125)
  .scrollX(0, ({time}) => Math.sin(time*0.05)*0.05 )
  .scrollY(0, ({time}) => Math.sin(time*0.01)*-0.07 )
  .pixelate([5,2,10],[15,8])
  .scale(0.15)
  .modulate(noise(1,0.25))
  .out()
```
