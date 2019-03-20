# Color

Functions for manipulating color.

- [.contrast(`amount`)](#.contrast(`amount`))
- [.color( `r`, `g`, `b` )](#.color( `r`, `g`, `b` ))
- [.colorama(`amount`)](#.colorama(`amount`))
- [.invert(`amount`)](#.invert(`amount`))
- [.luma( `threshold`, `tolerance` )](#.luma( `threshold`, `tolerance` ))
- [.thresh( `threshold`, `tolerance` )](#.thresh( `threshold`, `tolerance` ))

---

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