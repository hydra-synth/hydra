# Functions

## Argument Types

* float
* texture
* vec4

## Functions

### Color

#### invert

No Args

#### contrast

No Args

#### luma

#### Args
* threshold :: float
* tolerance :: float

#### thresh

#### Args
* threshold :: float
* tolerance :: float

#### color

#### Args
* r :: float
* g :: float
* b :: float

#### colorama

No Args


### Combine

#### add

#### Args
* color :: vec4
* amount :: float

#### layer

No Args

#### blend

#### Args
* color :: vec4
* amount :: float

#### mult

#### Args
* color :: vec4
* amount :: float

#### diff

No Args


### CombineCoord

#### modulate

#### Args
* color :: vec4
* amount :: float

#### modulateHue

#### Args
* color :: vec4
* amount :: float


### Coord

#### rotate

#### Args
* angle :: float
* speed :: float

#### scale

No Args

#### pixelate

#### Args
* pixelX :: float
* pixelY :: float

#### kaleid

No Args

#### scrollX

#### Args
* scrollX :: float
* speed :: float

#### scrollY

#### Args
* scrollY :: float
* speed :: float


### Src

#### noise

No Args

#### osc

#### Args
* frequency :: float
* sync :: float
* offset :: float

#### src

No Args

#### solid

#### Args
* r :: float
* g :: float
* b :: float
* a :: float


### Util

#### random

No Args

#### _noise

No Args

#### luminance

No Args

#### rgbToHsv

No Args

#### hsvToRgb

No Args



