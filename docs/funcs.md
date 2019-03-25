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
  - [brightness](#brightness)
  - [contrast](#contrast)
  - [color `vec4`](#color-vec4)
  - [colorama](#colorama)
  - [invert](#invert)
  - [luma](#luma)
  - [posterize](#posterize)
  - [saturate](#saturate)
  - [shift](#shift)
  - [thresh](#thresh)
- [Geometry](#geometry)
  - [kaleid](#kaleid)
  - [pixelate](#pixelate)
  - [repeat](#repeat)
  - [repeatX](#repeatX)
  - [repeatY](#repeatY)
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
  - [modulateRepeat](#modulateRepeat)
  - [modulateRepeatX](#modulateRepeatX)
  - [modulateRepeatY](#modulateRepeatY)
  - [modulateRotate](#modulateRotate)
  - [modulateScale](#modulateScale)
  - [modulateScrollX](#modulateScrollX)
  - [modulateScrollY](#modulateScrollY)
- [Operators](#operators)
  - [add](#add)
  - [blend](#blend)
  - [diff](#diff)
  - [layer](#layer)
  - [mask](#mask)
  - [mult](#mult)
- [Sources](#sources)
  - [gradient](#gradient)
  - [noise](#noise)
  - [osc](#osc)
  - [out](#out)
  - [render](#render)
  - [shape](#shape)
  - [solid](#solid)
  - [src](#src)
  - [voronoi](#voronoi)
- [Parameter sequences](#parameter-sequences)
  - [Lists as parameter sequences](#lists-as-parameter-sequences)
  - [Functions on parameter sequences](#functions-on-parameter-sequences)
    - [fast](#fast)

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

- [brightness](#brightness)
- [contrast](#contrast)
- [color `vec4`](#color-vec4)
- [colorama](#colorama)
- [invert](#invert)
- [luma](#luma)
- [posterize](#posterize)
- [saturate](#saturate)
- [shift](#shift)
- [thresh](#thresh)

### brightness

`.brightness( amount )`

* `amount` :: float (default `0.4`)

#### Example

```javascript
osc(20,0,2)
  .brightness( ({time}) => Math.sin(time) )
  .out(o0)
```

### contrast

`.contrast( amount )`

* `amount` :: float (default `1.6`)

Larger `amount` value makes higher contrast.

#### Example

```javascript
// 20Hz oscillator with contrast interpolating between 0.0-5.0
osc(20).contrast( ({time}) => Math.sin(time) * 5 ).out(o0)
```

### color `vec4`

`.color( r, g, b )`

* `r` :: float
* `g` :: float
* `b` :: float

Colorize texture.

#### Example

```javascript
// 20Hz oscillator source
// color sequence of Red, Green, Blue, White, Black
// output to buffer o0
osc(20).color([1,0,0,1,0],[0,1,0,1,0],[0,0,1,1,0]).out(o0)
```

### colorama

`.colorama( amount )`

* `amount` :: float (default `0.005`)

Shift HSV values.

#### Example

```javascript
// 20Hz oscillator source
// color sequence of Red, Green, Blue, White, Black
// colorama sequence of 0.005, 0.5, 1.0 at 1/8 speed
// output to buffer o0
osc(20)
  .color([1,0,0,1,0],[0,1,0,1,0],[0,0,1,1,0])
  .colorama([0.005,0.33,0.66,1.0].fast(0.125))
  .out(o0)
```

```javascript
// 
noise(3,0.1).colorama( ({time}) => Math.sin(time/5) ).out(o0)
```

### invert

`.invert( amount )`

* `amount` :: float (default `1.0`)

Invert color.

#### Example

```javascript
solid(1,1,1).invert([0,1]).out(o0)
```

### luma

`.luma( threshold, tolerance )`

* `threshold` :: float (default `0.5`)
* `tolerance` :: float (default `0.1`)

#### Example

```javascript
// default
osc(10,0,1).luma(0.5,0.1).out(o0)

osc(10,0,[0,0.5,1,2]).luma([0.1,0.25,0.75,1].fast(0.25),0.1).out(o0)
```

### posterize

`.posterize( bins, gamma )`

* `bins` :: float (default `3.0`)
* `gamma` :: float (default `0.6`)

#### Example

```javascript
// static gradient posterized, varying bins
gradient(0).posterize( [1, 5, 15, 30] , 0.5 ).out(o0)

// static gradient posterized, varying gamma
gradient(0).posterize( 3, [0.1, 0.5, 1.0, 2.0] ).out(o0)
```

### saturate

`.saturate( amount )`

* `amount` :: float (default `2.0`)

#### Example

```javascript
osc(10,0,1).saturate( ({time}) => Math.sin(time) * 10 ).out()
```

### shift

`.shift( r, g, b, a )`

* `r` :: float (default `0.5`)
* `g` :: float (default `0.5`)
* `b` :: float (default `0.5`)
* `a` :: float (default `0.5`)

#### Example

```javascript

```

### thresh

`.thresh( threshold, tolerance )`

* `threshold` :: float (default `0.5`)
* `tolerance` :: float (default `0.04`)

#### Example

```javascript
// default
noise(3,0.1).thresh(0.5,0.04).out(o0)

noise(3,0.1)
  .thresh( ({time})=>Math.sin(time/2) , [0.04,0.25,0.75,1].fast(0.25) )
  .out(o0)
```

---

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
osc( ({time}) => Math.sin(time) ).out(o0)
```

---

## Modulators

Functions for describing modulations of sources. 

- [modulate](#modulate)
- [modulateHue](#modulateHue)
- [modulateKaleid](#modulateKaleid)
- [modulatePixelate](#modulatePixelate)
- [modulateRepeat](#modulateRepeat)
- [modulateRepeatX](#modulateRepeatX)
- [modulateRepeatY](#modulateRepeatY)
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

#### Example

```javascript
// chocolate whirlpool
voronoi()
  .color(0.9,0.25,0.15)
  .rotate(({time})=>(time%360)/2)
  .modulate(osc(25,0.1,0.5)
            .kaleid(50)
            .scale(({time})=>Math.sin(time*1)*0.5+1)
            .modulate(noise(0.6,0.5)),
            0.5)
  .out(o0)
```

### modulateHue

`.modulateHue( color, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `1.0`)

Changes coordinates based on hue of second input. 
Based on:https://www.shadertoy.com/view/XtcSWM

#### Example

```javascript

```

### modulateKaleid

`.modulateKaleid( nSides )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `nSides` :: float (default `4.0`)

See also: [`kaleid`](#kaleid).

#### Example

```javascript
osc(9,-0.1,0.1)
  .modulateKaleid(osc(11,0.5,0),50)
  .scale(0.1,0.3)
  .modulate(noise(5,0.1))
  .mult(solid(1,1,0.3))
  .out(o0)
```

### modulatePixelate

`.modulatePixelate( multiple, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `10.0`)
* `offset` :: float (default `3.0`)

See also: [`pixelate`](#pixelate)

#### Example

```javascript
// what lies beneath
voronoi(10,1,5).brightness(()=>Math.random()*0.15)
  .modulatePixelate(noise(25,0.5),100)
  .out(o0)
```

### modulateRepeat

`.modulateRepeat( texture, repeatX, repeatY, offsetX, offsetY )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `repeatX` :: float (default `3.0`)
* `repeatY` :: float (default `3.0`)
* `offsetX` :: float (default `0.5`)
* `offsetY` :: float (default `0.5`)

#### Example

```javascript
// default
shape(4,0.9)
  .mult(osc(3,0.5,1))
  .modulateRepeat(osc(10), 3.0, 3.0, 0.5, 0.5)
  .out(o0)
```

### modulateRepeatX

`.modulateRepeatX( texture, reps, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `reps` :: float (default `3.0`)
* `offset` :: float (default `0.5`)

#### Example

```javascript
// straight lines illusion
shape(4,0.9)
  .mult(osc(4,0.25,1))
  .modulateRepeatX(osc(10), 5.0, ({time}) => Math.sin(time) * 5)
  .scale(1,0.5,0.05)
  .out(o0)
```

### modulateRepeatY

`.modulateRepeatY( texture, reps, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `reps` :: float (default `3.0`)
* `offset` :: float (default `0.5`)

#### Example

```javascript
// morphing grid
shape(4,0.9)
  .mult(osc(4,0.25,1))
  .modulateRepeatY(osc(10), 5.0, ({time}) => Math.sin(time) * 5)
  .scale(1,0.5,0.05)
  .out(o0)
```

### modulateRotate

`.modulateRotate( texture, multiple, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `1.0`)
* `offset` :: float (default `0.0`)

See also: [`rotate`](#rotate)

#### Example

```javascript
// wormhole
voronoi(100,3,5)
  .modulateRotate(osc(1,0.5,0).kaleid(50).scale(0.5),15,0)
  .mult(osc(50,-0.1,8).kaleid(9))
  .out(o0)
```

### modulateScale

`.modulateScale( multiple, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `multiple` :: float (default `1.0`)
* `offset` :: float (default `1.0`)

See also: [`scale`](#scale)

#### Example

```javascript
// cosmic radiation
gradient(5).repeat(50,50).kaleid([3,5,7,9].fast(0.5))
  .modulateScale(osc(4,-0.5,0).kaleid(50).scale(0.5),15,0)
  .out(o0)
```

### modulateScrollX

`.modulateScrollX( multiple, scrollX, speed )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `scrollX` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

See also: [`scrollX`](#scrollx)

#### Example

```javascript
// default
voronoi(25,0,0)
  .modulateScrollX(osc(10),0.5,0)
  .out(o0)

// different scroll and speed
voronoi(25,0,0)
  .modulateScrollX(osc(10),0.5,0.25)
  .out(o0)
```

### modulateScrollY

`.modulateScrollY( multiple, scrollX, speed )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `scrollY` :: float (default `0.5`)
* `speed` :: float (default `0.0`)

See also: [`scrollY`](#scrollY)

#### Example

```javascript
// default
voronoi(25,0,0)
  .modulateScrollY(osc(10),0.5,0)
  .out(o0)

// different scroll and speed
voronoi(25,0,0)
  .modulateScrollY(osc(10),0.5,0.25)
  .out(o0)
```

---

## Operators

Functions for performing operations on sources.

- [add](#add)
- [blend](#blend)
- [diff](#diff)
- [layer](#layer)
- [mask](#mask)
- [mult](#mult)

### add

`.add( texture, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `0.5`)

Add textures.

#### Example

```javascript
shape().scale(0.5).add(shape(4),[0,0.25,0.5,0.75,1]).out()

osc(9,0.1,1).add(osc(13,0.5,5)).out()
```

### blend

`.blend( texture, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `0.5`)

Blend textures.

#### Example

```javascript
shape().scale(0.5).blend(shape(4),[0,0.25,0.5,0.75,1]).out()

osc(9,0.1,1).blend(osc(13,0.5,5)).out()
```

### diff

`.diff( texture )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)

Return difference of textures.

#### Example

```javascript
osc(9,0.1,1).diff(osc(13,0.5,5)).out()

osc(1,1,2)
  .diff(shape(6,1.1,0.01)
        .scale(({time})=>Math.sin(time)*0.05 + 0.9)
        .kaleid(15)
        .rotate(({time})=>time%360))
  .out()
```

### layer

`.layer( texture )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)

Overlay texture based on alpha value.

#### Example

```javascript
solid(1,0,0,1).layer(shape(4).color(0,1,0,({time})=>Math.sin(time*2))).out()
```

### mask

`.mask( texture, reps, offset )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `reps` :: float (default `3.0`)
* `offset` :: float (default `0.5`)

#### Example

```javascript
// default
gradient(5).mask(voronoi(),3,0.5).invert([0,1]).out()

// algae pulse
osc(10,-0.25,1).color(0,0,1).saturate(2).kaleid(50)
  .mask(noise(25,2).modulateScale(noise(0.25,0.05)))
  .modulateScale(osc(6,-0.5,2).kaleid(50))
  .mult(osc(3,-0.25,2).kaleid(50))
  .scale(0.5,0.5,0.75)
  .out()
```

### mult

`.mult( texture, amount )`

* `texture`
  * `color` :: see [color `vec4`](#color-vec4)
  * `src` :: see [`src`](#src)
  * `shape` :: see [`shape`](#shape)
* `amount` :: float (default `1.0`)

Multiply images and blend with the texture by `amount`.

#### Example

```javascript
osc(9,0.1,2).mult(osc(13,0.5,5)).out()
```

---

## Sources

Sources are elementary generators that output different types of visual content.

- [gradient](#gradient)
- [noise](#noise)
- [osc](#osc)
- [out](#out)
- [render](#render)
- [shape](#shape)
- [solid](#solid)
- [src](#src)
- [voronoi](#voronoi)

### gradient

`gradient( speed )`

* `speed` :: float (default `x`)

#### Example

```javascript
// gradient sequence at speeds of 1, 2 & 4
gradient([1,2,4]).out(o0)
```

### noise

`noise( scale, offset )`

* `scale` :: int (default `10.0`)
* `offset` :: float (default `0.1`)

Generate [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise).

#### Example

```javascript
// noise interpolating between different scales and offsets
noise( ({time}) => Math.sin(time/10)*50 , ({time}) => Math.sin(time/2)/500 )
    .out(o0)
```

### osc

`osc( frequency, sync, offset )`

* `frequency` :: float (default `60.0`)
* `sync` :: float (default `0.1`)
* `offset` :: float (default `0.0`)

#### Example

```javascript
// frequency
osc( [1,10,50,100,250,500].fast(2) ).out(o0)

// frequency 2
osc( ({time}) => Math.sin(time/10) * 100 ).out(o0)

// sync
osc( 10, [-10,-1,-0.1,0,0.1,1,10], 0 ).out(o0)

// offset
osc(10,0.1, ({time}) => Math.sin(time/10) * 100 ).out(o0)
```

### out

`.out( buffer )`

* `buffer`
  * `osc`: `o0`, `o1`, `o2`, `o3`
  * `src`: `s0`, `s1`, `s2`, `s3`

#### Example

```javascript
// output four oscillators to different buffers
// and then modulate them together
osc( [1,10,50,100,250,500].fast(2) ).kaleid(20).out(o0) // frequency
osc( ({time}) => Math.sin(time/10) * 100 ).kaleid(19).out(o1) // frequency 2
osc( 10, [-10,-1,-0.1,0,0.1,1,10], 0 ).kaleid(21).out(o2) // sync
osc(10,0.1, ({time}) => Math.sin(time/10) * 1 ) // offset
  .modulate(o1,0.05)
  .modulate(o2,0.05)
  .modulate(o3,0.05)
  .kaleid(20)
  .add(noise(3,10))
  .out(o3)
render(o3)
```

### render

`render( buffer )`

* `buffer`: buffer (default `o0`)

#### Example

```javascript
osc( [1,10,50,100,250,500].fast(2) ).out(o0) // frequency
osc( ({time}) => Math.sin(time/10) * 100 ).out(o1) // frequency 2
osc( 10, [-10,-1,-0.1,0,0.1,1,10], 0 ).out(o2) // sync
osc(10,0.1, ({time}) => Math.sin(time/10) * 100 ).out(o3) // offset

render(o0) // change to o1, o2, or o3
```

```javascript
// see all four buffers at once
osc( [1,10,50,100,250,500].fast(2) ).out(o0) // frequency
osc( ({time}) => Math.sin(time/10) * 100 ).out(o1) // frequency 2
osc( 10, [-10,-1,-0.1,0,0.1,1,10], 0 ).out(o2) // sync
osc(10,0.1, ({time}) => Math.sin(time/10) * 100 ).out(o3) // offset
render()
```

### shape

`shape( sides, radius, smoothing)`

* `sides` :: int (default `3.0`)
* `radius` :: float (default `0.3`)
* `smoothing` :: float (default `0.01`)

#### Example

```javascript
// inverting blurry circle
shape(100,0.01,1).invert(({time})=>Math.sin(time)*2).out(o0)

// a... rainbow ball?
shape(5,0.5,0.1).repeat(19,19)
  .mult(osc(10,1,2))
  .rotate( ({time}) => time%360 )
  .scrollX(1,-0.25)
  .mult(shape(15,0.3,0.01)
        .rotate( ({time}) => time%360 )
        .scrollX(1,-0.25))
  .out(o0)
```

### solid

`solid( r, g, b, a )`

* `r` :: float (default `0.0`)
* `g` :: float (default `0.0`)
* `b` :: float (default `0.0`)
* `a` :: float (default `1.0`)

#### Example

```javascript
// cycling through red, green and blue
solid([1,0,0],[0,1,0],[0,0,1],1).out(o0)
```

### src

`src( input )`

* `input` :: input (examples: `o0`, `s1`)

See `hydra-examples` repository

### voronoi

`voronoi( scale, speed, blending )`

* `scale` :: float (default `5`)
* `speed` :: float (default `0.3`)
* `blending` :: float (default `0.3`)

Generate [voronoi shapes](https://en.wikipedia.org/wiki/Voronoi_diagram).

#### Example

```javascript
// default
voronoi(5,0.3,0.3).out(o0)

// fireflies
voronoi(25,2,10).color(1,1,0).brightness(0.15).out(o0)
```

---

## Parameter sequences

- [Lists as parameter sequences](#lists-as-parameter-sequences)
- [Functions on parameter sequences](#functions-on-parameter-sequences)
    - [fast](#fast)

### Lists as parameter sequences

```
osc(
   [80, 100, 200, 50], 1 )
)
.out(o0)
```

### Functions on parameter sequences

#### fast

`fast ( amount) `

* `amount` :: float (default `x`)

```
osc(
   [80, 100, 200, 50].fast(0.2), 1 )
)
.out(o0)
```
