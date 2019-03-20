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
// 
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

### shape

`shape( sides, radius, smoothing)`

* `sides` :: int (default `3.0`)
* `radius` :: float (default `0.3`)
* `smoothing` :: float (default `0.01`)

### solid

`solid( r, g, b, a )`

* `r` :: float (default `0.0`)
* `g` :: float (default `0.0`)
* `b` :: float (default `0.0`)
* `a` :: float (default `1.0`)

### src

`src( input )`

* `input` :: input (examples: `o0`, `s1`)

### voronoi

`voronoi( scale, speed, blending )`

* `scale` :: float (default `5`)
* `speed` :: float (default `0.3`)
* `blending` :: float (default `0.3`)

Generate [voronoi shapes](https://en.wikipedia.org/wiki/Voronoi_diagram).
