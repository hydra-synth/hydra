# Modulators

Functions for describing modulations of sources. 

- [.modulate( `texture`, `amount` )](#.modulate( `texture`, `amount` ))
- [.modulateHue( `color`, `amount` )](#.modulateHue( `color`, `amount` ))
- [.modulateKaleid( `nSides` )](#.modulateKaleid( `nSides` ))
- [.modulatePixelate( `multiple`, `offset` )](#.modulatePixelate( `multiple`, `offset` ))
- [.modulateRotate( `multiple`, `offset` )](#.modulateRotate( `multiple`, `offset` ))
- [.modulateScale( `multiple`, `offset` )](#.modulateScale( `multiple`, `offset` ))
- [.modulateScrollX( `multiple`, `scrollX`, `speed` )](#.modulateScrollX( `multiple`, `scrollX`, `speed` ))
- [.modulateScrollY( `multiple`, `scrollY`, `speed` )](#.modulateScrollY( `multiple`, `scrollY`, `speed` ))

---

### .modulate( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float (default 0.1)

Modulate texture. More about modulation at: <https://lumen-app.com/guide/modulation/>

### .modulateHue( `color`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float (default 1.0)

Changes coordinates based on hue of second input. Based on: <https://www.shadertoy.com/view/XtcSWM>

### .modulateKaleid( `nSides` )
* texture
  * color :: vec4
  * src
  * shape
* nSides :: float (default 4.0)

### .modulatePixelate( `multiple`, `offset` )
* texture
  * color :: vec4
  * src
  * shape
* multiple :: float (default 10.0)
* offset :: float (default 3.0)

### .modulateRotate( `multiple`, `offset` )
* texture
  * color :: vec4
  * src
  * shape
* multiple :: float (default 1.0)
* offset :: float (default 0.0)

### .modulateScale( `multiple`, `offset` )
* texture
  * color :: vec4
  * src
  * shape
* multiple :: float (default 1.0)
* offset :: float (default 1.0)

### .modulateScrollX( `multiple`, `scrollX`, `speed` )
* texture
  * color :: vec4
  * src
  * shape
* scrollX :: float (default 0.5)
* speed :: float (default 0.0)

### .modulateScrollY( `multiple`, `scrollY`, `speed` )
* texture
  * color :: vec4
  * src
  * shape
* scrollY :: float (default 0.5)
* speed :: float (default 0.0)