# Hydra
![hydra](docs/assets/hydra-3-01.png)

Set of tools for livecoding networked visuals. Inspired by analog modular synthesizers, these tools are an exploration into using streaming over the web for routing video sources and outputs in realtime.

Hydra uses multiple framebuffers to allow dynamically mixing, compositing, and collaborating between connected browser-visual-streams. Coordinate and color transforms can be applied to each output via chained functions.

Note: experimental/in development. Right now only works on Chrome or Chromium, on machines with WebGL.
I welcome pull requests as well as comments, ideas, and bugs in the issues section =]

For more information, see [getting started](#Getting-Started), [getting started pdf en español](https://github.com/ojack/hydra/blob/master/docs/CODEX%20HYDRA.pdf), [tutorials and examples](./examples/README.md), [the complete list of functions](./docs/funcs.md), [gallery of user-generated sketches](https://twitter.com/hydra_patterns?lang=es), or a [a talk about the motivations for creating hydra](https://www.youtube.com/watch?v=cw7tPDrFIQg).

Note: this repository is for the online version of hydra. Other pieces of hydra are published as separate modules:

* [hydra-synth](https://github.com/ojack/hydra-synth): synth engine of hydra as a standalone npm module
* [atom-hydra](https://github.com/ojack/atom-hydra): use hydra within atom
* [rtc-patch-bay](https://github.com/ojack/rtc-patch-bay): networking logic of hydra as a standalone npm module


## Getting started

Go to https://hydra.ojack.xyz

* CTRL-Enter: run a line of code
* CTRL-Shift-Enter: run all code on screen
* ALT-Enter: run a block
* CTRL-Shift-H: hide or show code
* CTRL-Shift-F: format code using [Prettier](https://prettier.io/)
* CTRL-Shift-S: Save screenshot and download as local file
* CTRL-Shift-G: Share to twitter (if available). Shares to [@hydra_patterns](https://twitter.com/hydra_patterns)

All code can be run either from the in-browser text editor or from the browser console.

Check [@hydra_patterns](https://twitter.com/hydra_patterns) for patterns folks have shared as an easy way to get started.

#### Basic functions
render an oscillator with parameters frequency, sync, and rgb offset:
```javascript
osc(20, 0.1, 0.8).out()
```

rotate the oscillator 0.8 radians:
```javascript
osc(20, 0.1, 0.8).rotate(0.8).out()
```
pixelate the output of the above function:
```javascript
osc(20, 0.1, 0.8).rotate(0.8).pixelate(20, 30).out()
```
show webcam output:
```javascript
s0.initCam() // initialize a webcam in source buffer s0
src(s0).out() // render source buffer s0
```
If you have more than one camera connected, you can select the camera using an index:
```javascript
s0.initCam(1) // initialize a webcam in source buffer s0
```
webcam kaleidoscope:
```javascript
s0.initCam() // initialize a webcam in source buffer s0
src(s0).kaleid(4).out() // render the webcam to a kaleidoscope
```

You can also composite multiple sources together:
```javascript
osc(10)
  .rotate(0.5)
  .diff(osc(200))
  .out()
```

By default, the environment contains four separate output buffers that can each render different graphics.  The outputs are accessed by the variables o0, o1, o2, and o3.

to render to output buffer o1:
```javascript
osc().out(o1)
render(o1) // render the contents of o1
```
If no output is specified in out(), the graphics are rendered to buffer o0.
to show all render buffers at once:
```javascript
render()
```

The output buffers can then be mixed and composited to produce what is shown on the screen.
```javascript
s0.initCam() // initialize a webcam in source buffer s0
src(s0).out(o0) // set the source of o0 to render the buffer containing the webcam
osc(10, 0.2, 0.8).diff(o0).out(o1) // initialize a gradient in output buffer o1, composite with the contents of o0
render(o1) // render o1 to the screen
```

The composite functions blend(), diff(), mult(), and add() perform arithmetic operations to combine the input texture color with the base texture color, similar to photoshop blend modes.

modulate(texture, amount) uses the red and green channels of the input texture to modify the x and y coordinates of the base texture. More about modulation at: https://lumen-app.com/guide/modulation/
```javascript
osc(21, 0).modulate(o1).out(o0)
osc(40).rotate(1.57).out(o1)
```

use a video as a source:
```javascript
s0.initVideo("https://media.giphy.com/media/AS9LIFttYzkc0/giphy.mp4")
src(s0).out()
```


use an image as a source:
```javascript
s0.initImage("https://upload.wikimedia.org/wikipedia/commons/2/25/Hydra-Foto.jpg")
src(s0).out()
```

#### Passing functions as variables
Each parameter can be defined as a function rather than a static variable. For example,
```javascript
osc(function(){return 100 * Math.sin(time * 0.1)}).out()
```
modifies the oscillator frequency as a function of time. (Time is a global variable that represents the milliseconds that have passed since loading the page). This can be written more concisely using es6 syntax:
```javascript
osc(() => (100 * Math.sin(time * 0.1))).out()
```

## Desktop capture
Open a dialog to select a screen tab to use as input texture:
```javascript
s0.initScreen()
src(s0).out()
```

## Connecting to remote streams
Any hydra instance can use other instances/windows containing hydra as input sources, as long as they are connected to the internet and not blocked by a firewall. Hydra uses webrtc (real time webstreaming) under the hood to share video streams between open windows. The included module rtc-patch-bay manages connections between connected windows, and can also be used as a standalone module to convert any website into a source within hydra. (See standalone camera source below for example.)

To begin, open hydra simultaneously in two separate windows.
In one of the windows, set a name for the given patch-bay source:
```javascript
pb.setName("myGraphics")
```
The title of the window should change to the name entered in setName().

From the other window, initiate "myGraphics" as a source stream.
```javascript
s0.initStream("myGraphics")
```
render to screen:
```javascript
s0.initStream("myGraphics")
src(s0).out()
```
The connections sometimes take a few seconds to be established; open the browser console to see progress.
To list available sources, type the following in the console:
```javascript
pb.list()
```

## Using p5.js with hydra

```javascript
// Initialize a new p5 instance It is only necessary to call this once
p5 = new P5() // {width: window.innerWidth, height:window.innerHeight, mode: 'P2D'}

// draw a rectangle at point 300, 100
p5.rect(300, 100, 100, 100)

// Note that P5 runs in instance mode, so all functions need to start with the variable where P5 was initialized (in this case p5)
// reference for P5: https://P5js.org/reference/
// explanation of instance mode: https://github.com/processing/P5.js/wiki/Global-and-instance-mode

// When live coding, the "setup()" function of P5.js has basically no use; anything that you would have called in setup you can just call outside of any function.

p5.clear()

for(var i = 0; i < 100; i++){
  p5.fill(i*10, i%30, 255)
  p5.rect(i*20, 200, 10,200)
}

// To live code animations, you can redefine the draw function of P5 as follows:
// (a rectangle that follows the mouse)
p5.draw = () => {
  p5.fill(p5.mouseX/5, p5.mouseY/5, 255, 100)
  p5.rect(p5.mouseX, p5.mouseY, 30, 150)
}

// To use P5 as an input to hydra, simply use the canvas as a source:
s0.init({src: p5.canvas})

// Then render the canvas
src(s0).repeat().out()
```

## Loading external scripts
The `await loadScript()` function lets you load other packaged javascript libraries within the hydra editor. Any javascript code can run in the hydra editor.

Here is an example using Three.js from the web editor:
```javascript
await loadScript("https://threejs.org/build/three.js")

scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height)
geometry = new THREE.BoxGeometry()
material = new THREE.MeshBasicMaterial({color: 0x00ff00})
cube = new THREE.Mesh(geometry, material);
scene.add(cube)
camera.position.z = 1.5

// 'update' is a reserved function that will be run every time the main hydra rendering context is updated
update = () => {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render( scene, camera );
}

s0.init({ src: renderer.domElement })

src(s0).repeat().out()
```

And here is an example loading the Tone.js library:
```javascript
await loadScript("https://unpkg.com/tone")

synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n");
```
## Running locally
To run locally, you must have nodejs, yarn and npm installed. Install node and npm from: https://nodejs.org/en/. Once you have node and npm installed, you can install yarn globally by running the following from the command line:
```
npm install --global yarn
```

To run, open terminal and enter the directory of the hydra source code:
```
cd hydra
```
install dependencies:
```
yarn install
```
run server
```
yarn serve
```
go to https://localhost:8000 in the browser

### Using submodules

If you would like to run all projects on the hydra website (such as the documentation, garden, and api documentation), you must also clone the repos added as submodules, i.e.:
```
git clone --recurse-submodules https://github.com/hydra-synth/hydra.git
```

To add current submodules to an existing checked-out version of the repo:
```
git submodule update --init
```

To pull latest versions of submodules:
```
git submodule foreach git pull origin main  
```


## To develop
Edit [frontend/public/index.html](frontend/public/index.html) to load 'bundle.js' rather than 'bundle.min.js'

Run development server
```
yarn dev
```



## Audio Responsiveness 
FFT functionality is available via an audio object accessed via "a". The editor uses https://github.com/meyda/meyda for audio analysis.
To show the fft bins,
```
a.show()
```
Set number of fft bins:
```
a.setBins(6)
```
Access the value of the leftmost (lowest frequency) bin:
```
a.fft[0]
```
Use the value to control a variable:
```
osc(10, 0, () => (a.fft[0]*4))
  .out()
```
It is possible to calibrate the responsiveness by changing the minimum and maximum value detected. (Represented by blur lines over the fft). To set minimum value detected:
```
a.setCutoff(4)
```

Setting the scale changes the range that is detected.
```
a.setScale(2)
```
The fft[<index>] will return a value between 0 and 1, where 0 represents the cutoff and 1 corresponds to the maximum.

You can set smoothing between audio level readings (values between 0 and 1). 0 corresponds to no smoothing (more jumpy, faster reaction time), while 1 means that the value will never change.
```
a.setSmooth(0.8)
```
To hide the audio waveform:
```
a.hide()
```
## MIDI (experimental)

MIDI controllers can work with Hydra via WebMIDI an example workflow is at [/docs/midi.md](https://github.com/ojack/hydra/blob/master/docs/midi.md) .

## API

There is an updated list of functions at [/docs/funcs.md](https://github.com/ojack/hydra/blob/master/docs/funcs.md).

As well as in the [source code for hydra-synth](https://github.com/ojack/hydra-synth/blob/master/src/glsl/glsl-functions.js).

#### CHANGELOG 
See [CHANGELOG.md](CHANGELOG.md) for recent changes.



 #### Libraries and tools used:
 * [Regl: functional webgl](http://regl.party/)
 * glitch.io: hosting for sandbox signalling server
 * codemirror: browser-based text editor
 * simple-peer

 ## Inspiration:
 * Space-Time Dynamics in Video Feedback (1984). [video](https://www.youtube.com/watch?v=B4Kn3djJMCE) and [paper](http://csc.ucdavis.edu/~cmg/papers/Crutchfield.PhysicaD1984.pdf) by Jim Crutchfield about using analog video feedback to model complex systems.
 * [Satellite Arts Project (1977) - Kit Galloway and Sherrie Rabinowitz](http://www.ecafe.com/getty/SA/)
 * [Sandin Image Processor](http://www.audiovisualizers.com/toolshak/vidsynth/sandin/sandin.htm)
 * [kynd - reactive buffers experiment](https://kynd.github.io/reactive_buffers_experiment/)

 #### Related projects:
 * [Lumen app (osx application)](https://lumen-app.com/)
 * [Vsynth (package for MaxMSP)](https://cycling74.com/forums/vsynth-package)
 * [VEDA (VJ system within atom)](https://veda.gl/)
 * [The Force](https://videodromm.com/The_Force/)
