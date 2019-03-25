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
