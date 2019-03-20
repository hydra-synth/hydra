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
osc( [1,10,50,100,250,500].fast(2) ).out(o0) // frequency
osc( ({time}) => Math.sin(time/10) * 100 ).out(o1) // frequency 2
osc( 10, [-10,-1,-0.1,0,0.1,1,10], 0 ).out(o2) // sync
osc(10,0.1, ({time}) => Math.sin(time/10) * 100 ) // offset
  .modulate(o1,0.05)
  .modulate(o2,0.05)
  .modulate(o3,0.05)
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
