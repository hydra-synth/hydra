## Hydra
![hydra](https://github.com/ojack/hydra/blob/master/hydra.jpg?raw=true)

Set of tools for livecoding networked visuals. Inspired by analog modular synthesizers, these tools are an exploration into using streaming over the web for routing networked sources and outputs in realtime. Hydra uses multiple framebuffers to allow dynamically mixing, compositing, and collaborating between connected browser-visual-streams.

Note: experimental/in development. Right now only works on Chrome or Chromium, on machines with WebGL.

### Getting started

* CTRL-Enter: run a line of code
* CTRL-Shift-Enter: run all code on screen 
* CTRL-Shift-H: hide or show code

All code can be run either from the in-browser IDE or from the browser console.

#### Basic functions
render a simple oscillator. For more information about oscillators, see the lumen guide. [oscillator](https://lumen-app.com/guide/oscillators/):
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

to show all render buffers at once:
```
render()
```

The output buffers can then be mixed and composited to produce what is shown on the screen.
```
s0.initCam() //initialize a webcam in source buffer s0
o0.src(s0) //set the source of o0 to render the buffer containing the webcam
o1.gradient().diff(o0) //initialize a gradient in source buffer o1, composite with the contents of o0
render(o1) // render o1 to the screen
```

The composite functions blend(), diff(), mult(), and add() perform arithmetic operations to combine the input texture with the base texture, similar to photoshop blend modes.

modulate(texture, amount) uses the red and green channels of the input texture to modify the x and y coordinates of the base texture. More about modulation at: https://lumen-app.com/guide/modulation/
```
o0.osc(21, 0).modulate(o1)
o1.osc(40).rotate(1.57)
```
#### Passing functions as variables (work in progress)
Each parameter can be defined as a function rather than a static variable. For example,
```
o0.osc(function(t){return 100*Math.sin(t*0.1)})
```
modifies the oscillator frequency as a function of time. This can be written more concisely using es6 syntax as:
```
o0.osc((t)=>(100*Math.sin(t*0.1)))
```
## Desktop capture
To use screen capture or a browser tab as an input texture, you must first install the chrome extension for screensharing, and restart chrome.
To install, go to http://chrome://extensions/
Click "Load unpacked extension", and select the "extensions" folder in "screen-capture-extension" in this repo.

select a screen tab to use as input texture:
```
s0.initScreen()
```

render screen tab:
```
s0.initScreen()
o0.src(s0)
```

## Connecting to remote streams
Any hydra instance can use other instances/windows as input sources, as long as they are connected to the internet. Hydra uses webrtc (real time webstreaming) under the hood to share graphics between instances. The included module rtc-patch-bay manages connections between connected windows, and can also be used as a standalone module to convert any website into a source within hydra. (See standalone source below for example.)

To begin, open hydra simultaneously in two separate windows.
In one of the windows, set a name for the given patch-bay source:
```
pb.setName("myGraphics")
```
The title of the window should change to the name entered in setName().

From the other window, initiate "myGraphics" as a source stream.
```
s0.initStream("myGraphics")
```
render to screen:
```
s0.initStream("myGraphics")
o0.src(s0)
```
The connections sometimes take a few seconds to be established; open the browser console to see progress.
To list connected sources:
```
pb.list()
```

#### Standalone camera source


## Running locally
To run locally, you must have nodejs and npm installed. Install from: https://nodejs.org/en/

open terminal and enter directory
```
cd hydra
```
install dependencies:
```
npm install -d
```
run server
```
npm run start
```

go to https://localhost:8000 in the browser

### Adding/editing transformation functions

All of the available functions for transforming coordinates and color correspond directly to a snippet of fragment shader code, defined in the file hydra/hydra-server/app/src/glslTransforms.json. When running locally, you can edit this file to change the available functions, and refresh the page to see changes.


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

* mult (source, amount)

* diff (source)

* add (source, amount)

* blend (source, amount)

* modulate (source, amount)


## Configure Sources

* s0.initCam()

* s0.initScreen()

* s0.initStream("name of remote")


 ### Libraries and tools used:
 * Regl: functional webgl
 * glitch.io: hosting for sandbox signalling server
 * codemirror
 * simple-peer

 ### Similar projects:
 * atom-veda:
 * the force

 ### Inspiration:
 * Space-time dynamics in video feedback
 * Satellite arts project
 * Eduardo kac
 * Sandin Image Processor
 * Lumen app
 * kynd.info reactive buffers experiment
 * GEM/vsynth
