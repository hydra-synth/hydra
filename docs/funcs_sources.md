# Sources

Sources are the 

- [osc( `frequency`, `sync`, `offset` )](#osc( `frequency`, `sync`, `offset` ))
- [render( `output buffer`)](#render( `output buffer`))
- [shape( `sides`, `radius`, `smoothing`)](#shape( `sides`, `radius`, `smoothing`))
- [solid( `r`, `g`, `b`, `a`)](#solid( `r`, `g`, `b`, `a`))
- [gradient( `speed` )](#gradient( `speed` ))
- [src( `input` )](#src( `input` ))
- [noise( `scale`, `offset` )](#noise( `scale`, `offset` ))
- [voronoi( `scale`, `speed`, `blending` )](#voronoi( `scale`, `speed`, `blending` ))
- [.out( `output buffer` )](#.out( `output buffer` ))

---

### osc( `frequency`, `sync`, `offset` )
* frequency :: float (default 60.0)
* sync :: float (default 0.1)
* offset :: float (default 0.0)

### render( `output buffer`)
* default: `o0`

### shape( `sides`, `radius`, `smoothing`)
* sides :: int (default 3.0)
* radius :: float (default 0.3)
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

### voronoi( `scale`, `speed`, `blending` )
* scale :: float (default 5)
* speed :: float (default 0.3)
* blending :: float (default 0.3)

Generate voronoi shapes.

### .out( `output buffer` )
* output buffer
  * osc: `o0`, `o1`, `o2`, `o3`
  * src: `s0`, `s1`, `s2`, `s3`