## Hydra
![hydra](https://github.com/ojack/hydra/blob/master/hydra.jpg?raw=true)

Set of tools for livecoding networked visuals. Inspired by analog modular synthesizers, these tools are an exploration into using streaming over the web for routing networked sources and outputs in realtime. Hydra uses multiple framebuffers to allow dynamically mixing, compositing, and collaborating between connected browser-visual-streams.

Note: experimental/in development. Right now only works on Chrome or Chromium, on machines with WebGL.

### Getting started
Go to: http://ojack.github.io/hydra

* CTRL-Enter: run a line of code
* CTRL-Shift-Enter: run all code on screen (note: sometimes causes bug in stream input)
* CTRL-Shift-H: hide or show code


All code can be run either from the in-browser IDE or from the browser console.

render a simple oscillator:
```
o0.osc()
```

render an oscillator with parameters frequency, sync, and rgb offset:
```
o0.osc(200, 0.1, 0.8)
```

show webcam output:
```
s0.initCam() //initialize a webcam in source buffer s0
o0.src(s0) //set the source of o0 to render the buffer containing the webcam
```

webcam kaleidoscope:
```
s0.initCam() //initialize a webcam in source buffer s0
o0.src(s0).kaleid(4) //render the webcam to a kaleidoscope
```

By default, the environment contains four separate output buffers that can each render different graphics.  The outputs are accessed by the variables o0, o1, o2, and o3.

to render to output buffer o1:
```
o1.gradient()
render(o1) //render the contents of o1
```

The output buffers can then be mixed and composited to produce what is shown on the screen.
```
s0.initCam() //initialize a webcam in source buffer s0
o0.src(s0) //set the source of o0 to render the buffer containing the webcam
o1.gradient().diff(o0) //initialize a gradient in source buffer o1, composite with the contents of o0
render(o1) // render o1 to the screen
```

Desktop capture:
Through realtime streaming, it is possible to comp


## Connecting to remote streams


## Modules contained in this repo (eventually will be separated into standalone modules):

- jelly-editor: lightweight online editor
    - jelly-synth: module for compositing and transforming signals/streams
    - rtc-patch-bay: module for managing connections between connected peers
    - examples
- screenmedia-extension: browser extension for allowing access to desktop capture
- jelly-camera: standalone app for broadcasting a webcam or desktop tab as a source for a a hydra room. open in any desktop or android browser

# EDITOR

## General Usage
* CTRL-Enter: run a line of code

* CTRL-Shift-Enter: run all code on page

(to implement: toggle source list, toggle showing code)

### Tab and desktop capture
(Install extension to chrome or firefox from )

## API

### Output signal transformations

#### Define source
* src(source)

* gradient()

#### Coordinate transformations

* repeat(repeatX, repeatY, offsetX, offsetY)

* rotate(rotateAmount)

* kaleid (numSides)


##### Color transformations

* contrast (contrastAmount)

* brightness (brightnessAmount)

* posterize (numBins)

#### Composite operations

* mult (source)

* diff (source)

* add (source)

* modulate (source, amount)

(shader passes)

## Configure Sources

* s0.initCam()

* s0.initScreen()

* s0.initRemote("name of remote")

(s0.stop())
(s0.iniVid())

(Dynamically create a shader pass or transformation)
(Passing functions as parameters)

## Connect to remote video streams (via rtc patch bay)

* pb.init()

* pb.setName("")

(pb.setServer("server location"))
(pb.setRoom("room name"))
 * pb.list()

 ### Libraries and tools used:
 Regl: functional webgl
 glitch.io: hosting for sandbox signalling server
 codemirror
 simple-peer

 ### Similar projects:
 atom-veda:
 the force

 ### Inspiration:
 Space-time dynamics in video feedback
 Satellite arts project
 Eduardo kac
 Sandin Image Processor
 Lumen app
 kynd.info reactive buffers experiment
 GEM/vsynth
