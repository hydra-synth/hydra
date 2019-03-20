# Operators

Functions for performing operations on sources.

- [.add( `texture`, `amount` )](#.add( `texture`, `amount` ))
- [.blend( `texture`, `amount` )](#.blend( `texture`, `amount` ))
- [.diff( `texture` )](#.diff( `texture` ))
- [.layer()](#.layer())
- [.mult( `texture`, `amount` )](#.mult( `texture`, `amount` ))

---

### .add( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float (default 0.5)

Add textures.

### .blend( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float (default 0.5)

Blend textures.

### .diff( `texture` )
* texture
  * color :: vec4
  * src
  * shape

Return difference of textures.

### .layer()

Overlay texture based on alpha value.

### .mult( `texture`, `amount` )
* texture
  * color :: vec4
  * src
  * shape
* amount :: float (default 1.0)

Multiply images and blend with the texture by `amount`.