# Hydra
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-36-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
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
To run locally, you must have nodejs installed. Install node and npm from: https://nodejs.org/en/. 

To run, open terminal and enter the directory of the hydra source code:
```
cd hydra
```
install dependencies:
```
npm install
```
run dev environment
```
npm dev
```

## Connecting to server from dev/ local editor environment
This repo only contains hydra editor frontend. You can connect to a backend server (https://github.com/hydra-synth/hydra-server) for signaling and gallery functionality. To do this, set up hydra-server from above. Then create a `.env` file in the root of the `hydra` directory. Add the url of your server as a line in the .env file as:
```
VITE_SERVER_URL=http://localhost:8000
```
(replace http://localhost:8000 with the url of your server)

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

## Contributors

(Adapted from [p5.js](https://github.com/processing/p5.js))  
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://ojack.xyz"><img src="https://avatars.githubusercontent.com/u/4909769?v=4?s=100" width="100px;" alt="Olivia Jack"/><br /><sub><b>Olivia Jack</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=ojack" title="Code">💻</a> <a href="#blog-ojack" title="Blogposts">📝</a> <a href="https://github.com/hydra-synth/hydra/issues?q=author%3Aojack" title="Bug reports">🐛</a> <a href="#design-ojack" title="Design">🎨</a> <a href="https://github.com/hydra-synth/hydra/commits?author=ojack" title="Documentation">📖</a> <a href="#eventOrganizing-ojack" title="Event Organizing">📋</a> <a href="#example-ojack" title="Examples">💡</a> <a href="#financial-ojack" title="Financial">💵</a> <a href="#fundingFinding-ojack" title="Funding Finding">🔍</a> <a href="#ideas-ojack" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-ojack" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#plugin-ojack" title="Plugin/utility libraries">🔌</a> <a href="#question-ojack" title="Answering Questions">💬</a> <a href="https://github.com/hydra-synth/hydra/pulls?q=is%3Apr+reviewed-by%3Aojack" title="Reviewed Pull Requests">👀</a> <a href="#talk-ojack" title="Talks">📢</a> <a href="https://github.com/hydra-synth/hydra/commits?author=ojack" title="Tests">⚠️</a> <a href="#tool-ojack" title="Tools">🔧</a> <a href="#translation-ojack" title="Translation">🌍</a> <a href="#tutorial-ojack" title="Tutorials">✅</a> <a href="#video-ojack" title="Videos">📹</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.fentonia.com/bio/"><img src="https://avatars.githubusercontent.com/u/8839978?v=4?s=100" width="100px;" alt="Jamie Fenton"/><br /><sub><b>Jamie Fenton</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=jamiefaye" title="Code">💻</a> <a href="#ideas-jamiefaye" title="Ideas, Planning, & Feedback">🤔</a> <a href="#video-jamiefaye" title="Videos">📹</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://naotohieda.com"><img src="https://avatars.githubusercontent.com/u/1835081?v=4?s=100" width="100px;" alt="Naoto Hieda"/><br /><sub><b>Naoto Hieda</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=micuat" title="Documentation">📖</a> <a href="#eventOrganizing-micuat" title="Event Organizing">📋</a> <a href="#example-micuat" title="Examples">💡</a> <a href="#ideas-micuat" title="Ideas, Planning, & Feedback">🤔</a> <a href="#tutorial-micuat" title="Tutorials">✅</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/flordefuego"><img src="https://avatars.githubusercontent.com/u/31332673?v=4?s=100" width="100px;" alt="flordefuego"/><br /><sub><b>flordefuego</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=flordefuego" title="Documentation">📖</a> <a href="#eventOrganizing-flordefuego" title="Event Organizing">📋</a> <a href="#example-flordefuego" title="Examples">💡</a> <a href="#ideas-flordefuego" title="Ideas, Planning, & Feedback">🤔</a> <a href="#tutorial-flordefuego" title="Tutorials">✅</a> <a href="#video-flordefuego" title="Videos">📹</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://zachkrall.com"><img src="https://avatars.githubusercontent.com/u/2532937?v=4?s=100" width="100px;" alt="Zach Krall"/><br /><sub><b>Zach Krall</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=zachkrall" title="Documentation">📖</a> <a href="https://github.com/hydra-synth/hydra/commits?author=zachkrall" title="Code">💻</a> <a href="#tutorial-zachkrall" title="Tutorials">✅</a> <a href="#example-zachkrall" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/geikha"><img src="https://avatars.githubusercontent.com/u/56176668?v=4?s=100" width="100px;" alt="Renzo Torr-"/><br /><sub><b>GEIKHA</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/issues?q=author%3Ageikha" title="Bug reports">🐛</a> <a href="https://github.com/hydra-synth/hydra/commits?author=geikha" title="Code">💻</a> <a href="#eventOrganizing-geikha" title="Event Organizing">📋</a> <a href="#example-geikha" title="Examples">💡</a> <a href="#ideas-geikha" title="Ideas, Planning, & Feedback">🤔</a> <a href="#plugin-geikha" title="Plugin/utility libraries">🔌</a> <a href="#translation-geikha" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://sophiadigitalart.com"><img src="https://avatars.githubusercontent.com/u/138158?v=4?s=100" width="100px;" alt="Bruce LANE"/><br /><sub><b>Bruce LANE</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=brucelane" title="Code">💻</a> <a href="#example-brucelane" title="Examples">💡</a> <a href="#ideas-brucelane" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://fangtsai.net"><img src="https://avatars.githubusercontent.com/u/25447809?v=4?s=100" width="100px;" alt="fangtasi"/><br /><sub><b>fangtasi</b></sub></a><br /><a href="#translation-fangtsai15" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/choiharam"><img src="https://avatars.githubusercontent.com/u/46865987?v=4?s=100" width="100px;" alt="Haram Choi"/><br /><sub><b>Haram Choi</b></sub></a><br /><a href="#translation-choiharam" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/papaz0rgl"><img src="https://avatars.githubusercontent.com/u/2632092?v=4?s=100" width="100px;" alt="papaz0rgl"/><br /><sub><b>papaz0rgl</b></sub></a><br /><a href="#translation-papaz0rgl" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/arturcabral"><img src="https://avatars.githubusercontent.com/u/4428256?v=4?s=100" width="100px;" alt="Artur Cabral "/><br /><sub><b>Artur Cabral </b></sub></a><br /><a href="#translation-arturcabral" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://linktr.ee/ranggapuraji"><img src="https://avatars.githubusercontent.com/u/37600867?v=4?s=100" width="100px;" alt="Rangga Purnama Aji"/><br /><sub><b>Rangga Purnama Aji</b></sub></a><br /><a href="#translation-RanggaPAji" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://jackarmitage.com/"><img src="https://avatars.githubusercontent.com/u/2885827?v=4?s=100" width="100px;" alt="Jack Armitage"/><br /><sub><b>Jack Armitage</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=jarmitage" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://rumblesan.com/"><img src="https://avatars.githubusercontent.com/u/169088?v=4?s=100" width="100px;" alt="Guy John"/><br /><sub><b>Guy John</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=rumblesan" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mcscope"><img src="https://avatars.githubusercontent.com/u/3921648?v=4?s=100" width="100px;" alt="Christopher Beacham"/><br /><sub><b>Christopher Beacham</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=mcscope" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ssssam"><img src="https://avatars.githubusercontent.com/u/6330?v=4?s=100" width="100px;" alt="Sam Thursfield"/><br /><sub><b>Sam Thursfield</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=ssssam" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kagel"><img src="https://avatars.githubusercontent.com/u/100986?v=4?s=100" width="100px;" alt="Dmitriy Khvatov"/><br /><sub><b>Dmitriy Khvatov</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=kagel" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/echophon"><img src="https://avatars.githubusercontent.com/u/5997208?v=4?s=100" width="100px;" alt="Yancy Way"/><br /><sub><b>Yancy Way</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=echophon" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tpltnt"><img src="https://avatars.githubusercontent.com/u/1172976?v=4?s=100" width="100px;" alt="tpltnt"/><br /><sub><b>tpltnt</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=tpltnt" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/frodosamoa"><img src="https://avatars.githubusercontent.com/u/1582620?v=4?s=100" width="100px;" alt="Andrew Kowalczyk"/><br /><sub><b>Andrew Kowalczyk</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=frodosamoa" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ethancrawford"><img src="https://avatars.githubusercontent.com/u/10395940?v=4?s=100" width="100px;" alt="ethancrawford"/><br /><sub><b>ethancrawford</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=ethancrawford" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/hamilton"><img src="https://avatars.githubusercontent.com/u/95735?v=4?s=100" width="100px;" alt="Hamilton Ulmer"/><br /><sub><b>Hamilton Ulmer</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=hamilton" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jcmorrow"><img src="https://avatars.githubusercontent.com/u/5903784?v=4?s=100" width="100px;" alt="Josh Morrow"/><br /><sub><b>Josh Morrow</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=jcmorrow" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/fizzy123"><img src="https://avatars.githubusercontent.com/u/4475554?v=4?s=100" width="100px;" alt="Nobel Yoo"/><br /><sub><b>Nobel Yoo</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=fizzy123" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/pLabarta"><img src="https://avatars.githubusercontent.com/u/10605905?v=4?s=100" width="100px;" alt="Pablito Labarta"/><br /><sub><b>Pablito Labarta</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=pLabarta" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.paulwrankin.com/"><img src="https://avatars.githubusercontent.com/u/1256849?v=4?s=100" width="100px;" alt="Paul W. Rankin"/><br /><sub><b>Paul W. Rankin</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=rnkn" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/tmhglnd"><img src="https://avatars.githubusercontent.com/u/8721936?v=4?s=100" width="100px;" alt="Timo Hoogland"/><br /><sub><b>Timo Hoogland</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=tmhglnd" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ixnv"><img src="https://avatars.githubusercontent.com/u/4655259?v=4?s=100" width="100px;" alt="Ramil Iksanov"/><br /><sub><b>Ramil Iksanov</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=ixnv" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://0xacab.org/rapofran"><img src="https://avatars.githubusercontent.com/u/2479433?v=4?s=100" width="100px;" alt="J. Francisco Raposeiras"/><br /><sub><b>J. Francisco Raposeiras</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=rapofran" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://larstuchel.ch/"><img src="https://avatars.githubusercontent.com/u/17312696?v=4?s=100" width="100px;" alt="Lars Fabian Tuchel"/><br /><sub><b>Lars Fabian Tuchel</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=tuchella" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/oscons"><img src="https://avatars.githubusercontent.com/u/54054343?v=4?s=100" width="100px;" alt="oscons"/><br /><sub><b>oscons</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=oscons" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://richardnias.com/"><img src="https://avatars.githubusercontent.com/u/7244202?v=4?s=100" width="100px;" alt="Richard Nias"/><br /><sub><b>Richard Nias</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=richardnias" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://hi-bumblebee.com/"><img src="https://avatars.githubusercontent.com/u/53626283?v=4?s=100" width="100px;" alt="Luis Aguirre"/><br /><sub><b>Luis Aguirre</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=luis11011" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/munshkr"><img src="https://avatars.githubusercontent.com/u/4862?v=4?s=100" width="100px;" alt="Damián Silvani"/><br /><sub><b>Damián Silvani</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=munshkr" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/misterinterrupt"><img src="https://avatars.githubusercontent.com/u/286920?v=4?s=100" width="100px;" alt="m. interrupt"/><br /><sub><b>m. interrupt</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=misterinterrupt" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://atenor.io/?pk_campaign=github"><img src="https://avatars.githubusercontent.com/u/7475584?v=4?s=100" width="100px;" alt="Ámbar Tenorio-Fornés"/><br /><sub><b>Ámbar Tenorio-Fornés</b></sub></a><br /><a href="https://github.com/hydra-synth/hydra/commits?author=atfornes" title="Code">💻</a> <a href="#ideas-atfornes" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
We recognize all types of contributions. This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Instructions to add yourself or add contribution emojis to your name are [here](https://github.com/hydra-synth/hydra/issues/265). You can also post an issue or comment with the text: `@all-contributors please add @YOUR-USERNAME for THING(S)` and our nice bot will add you.

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
