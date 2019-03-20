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

### noise

`noise( scale, offset )`

* `scale` :: int (default `10.0`)
* `offset` :: float (default `0.1`)

Generate [Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise).

### osc

`osc( frequency, sync, offset )`

* `frequency` :: float (default `60.0`)
* `sync` :: float (default `0.1`)
* `offset` :: float (default `0.0`)

### out

`.out( buffer )`

* `buffer`
  * `osc`: `o0`, `o1`, `o2`, `o3`
  * `src`: `s0`, `s1`, `s2`, `s3`

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
