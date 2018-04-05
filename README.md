### Hydra
![hydra](https://github.com/ojack/hydra/blob/master/hydra-3-01.png?raw=true)

Set of tools for livecoding networked visuals. Inspired by analog modular synthesizers, these tools are an exploration into using streaming over the web for routing video sources and outputs in realtime.

Hydra uses multiple framebuffers to allow dynamically mixing, compositing, and collaborating between connected browser-visual-streams. Coordinate and color transforms can be applied to each output via chained functions (see "basic functions" and "editing transformation functions" below.)

Note: experimental/in development. Right now only works on Chrome or Chromium, on machines with WebGL.
I welcome pull requests as well as comments, ideas, and bugs in the issues section =]

#### Getting started

Go to https://hydra-editor.glitch.me

* CTRL-Enter: run a line of code
* CTRL-Shift-Enter: run all code on screen
* ALT-Enter: run a block
* CTRL-Shift-H: hide or show code

All code can be run either from the in-browser text editor or from the browser console.

#### Basic functions
render an oscillator with parameters frequency, sync, and rgb offset:
```
osc(20, 0.1, 0.8).out()
```

rotate the oscillator 1.5 radians:
```
osc(20, 0.1, 0.8).rotate(0.8).out()
```
pixelate the output of the above function:
```
osc(20, 0.1, 0.8).rotate(0.8).pixelate(20, 30).out()
```
show webcam output:
```
s0.initCam() //initialize a webcam in source buffer s0
src(s0).out() //render source buffer s0
```

webcam kaleidoscope:
```
s0.initCam() //initialize a webcam in source buffer s0
src(s0).kaleid(4).out() //render the webcam to a kaleidoscope
```

By default, the environment contains four separate output buffers that can each render different graphics.  The outputs are accessed by the variables o0, o1, o2, and o3.
to render to output buffer o1:
```
osc().out(o1)
render(o1) //render the contents of o1
```

to show all render buffers at once:
```
render()
```

The output buffers can then be mixed and composited to produce what is shown on the screen.
```
s0.initCam() //initialize a webcam in source buffer s0
src(s0).out(o0) //set the source of o0 to render the buffer containing the webcam
osc(10, 0.2, 0.8).diff(o0).out(o1) //initialize a gradient in output buffer o1, composite with the contents of o0
render(o1) // render o1 to the screen
```

The composite functions blend(), diff(), mult(), and add() perform arithmetic operations to combine the input texture color with the base texture color, similar to photoshop blend modes.

modulate(texture, amount) uses the red and green channels of the input texture to modify the x and y coordinates of the base texture. More about modulation at: https://lumen-app.com/guide/modulation/
```
osc(21, 0).modulate(o1).out(o0)
osc(40).rotate(1.57).out(o1)
```

#### Passing functions as variables
Each parameter can be defined as a function rather than a static variable. For example,
```
osc(function({time}){return 100*Math.sin(time*0.1)}).out()
```
modifies the oscillator frequency as a function of time. This can be written more concisely using es6 syntax:
```
osc(({t}) => (100*Math.sin(time*0.1))).out()
```

#### Desktop capture
To use screen capture or a browser tab as an input texture, you must first install the chrome extension for screensharing, and restart chrome. Desktop capture can be useful for inputing graphics from another application, or a video or website in another browser tab. It can also be used to create interesting feedback effects.

To install, go to http://chrome://extensions/
Click "Load unpacked extension", and select the "extensions" folder in "screen-capture-extension" in this repo. Restart chrome. The extension should work from now on without needing to reinstall.

select a screen tab to use as input texture:
```
s0.initScreen()
```

render screen tab:
```
s0.initScreen()
o0.src(s0)
```

#### Connecting to remote streams
Any hydra instance can use other instances/windows containing hydra as input sources, as long as they are connected to the internet and not blocked by a firewall. Hydra uses webrtc (real time webstreaming) under the hood to share video streams between open windows. The included module rtc-patch-bay manages connections between connected windows, and can also be used as a standalone module to convert any website into a source within hydra. (See standalone camera source below for example.)

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
To list available sources, type the following in the console:
```
pb.list()
```

#### Standalone camera source
Example of using patch-bay without hydra, that lets you use the camera of a phone or a computer as a source in the network, without needing to open the hydra editor. (Most likely only works with android phones until apple fully supports WebRTC/)
live at: https://hydra-editor.glitch.me/camera.html
source at: app/src/camera.js & camera.html

#### Running locally
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

#### Adding/editing transformation functions

All of the available functions for transforming coordinates and color, as well as compositing textures, correspond directly to a snippet of fragment shader code. These transformations are defined in the file hydra/hydra-server/app/src/glslTransforms.js. When running locally, you can edit this file to change the available functions, and refresh the page to see changes.


#### API

For updated list of functions, see glslTransforms.js file in hydra/hydra-server/app/src/

 #### Libraries and tools used:
 * [Regl: functional webgl](http://regl.party/)
 * glitch.io: hosting for sandbox signalling server
 * codemirror: browser-based text editor
 * simple-peer

 #### Inspiration:
 * Space-Time Dynamics in Video Feedback (1984). [video](https://www.youtube.com/watch?v=B4Kn3djJMCE) and [paper](http://csc.ucdavis.edu/~cmg/papers/Crutchfield.PhysicaD1984.pdf) by Jim Crutchfield about using analog video feedback to model complex systems.
 * [Satellite Arts Project (1977) - Kit Galloway and Sherrie Rabinowitz](http://www.ecafe.com/getty/SA/)
 * [Sandin Image Processor](http://www.audiovisualizers.com/toolshak/vidsynth/sandin/sandin.htm)
 * [kynd - reactive buffers experiment](https://kynd.github.io/reactive_buffers_experiment/)

 #### Related projects:
 * [Lumen app (osx application)](https://lumen-app.com/)
 * [Vsynth (package for MaxMSP)] (https://cycling74.com/forums/vsynth-package)
 * [VEDA (VJ system within atom)](https://veda.gl/)
 * [The Force](https://videodromm.com/The_Force/)
