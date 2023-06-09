# Additional Topics

## live coding: evaluate separate lines or blocks of code

Press ‘ctrl+enter’ to run a line of code.  
Press ‘shift+ctrl+enter’ to evaluate a block of code.  
Tip: You can switch between different lines of code for a live coding performance.

```javascript
osc().out() //run this first

noise().mult(osc(10,0.1,10)).out() //now try this one
```

## feedback

## a) arrays

Arrays in Hydra are a sequenced collection of values. You can use this to change several parameters in time.

```javascript
osc(10,0.1,[10,0,2,0.5]).out()

shape([3,4,200,2]).out()
```

## b) audio

Make audio reactive visuals using. The audio signal works as an input parameter, you can multiplicate this value in order to change the amount of changes.

```javascript
osc(20,0.1, ()=>a.ff[0]*10).out()
```


## d) screen capture

## e) atom-hydra

## f) custom javascript functions

## h) p5.js

## loadScript()

## g) custom glsl functions https://hydra-book.glitch.me/#/glsl 

## f) hydra in a webpage


## from old document:

## Array

## Passing functions as variables
Each parameter can be defined as a function rather than a static variable. For example,
```javascript
osc(function(){return 100 * Math.sin(time * 0.1)}).out()
```
modifies the oscillator frequency as a function of time. (Time is a global variable that represents the seconds that have passed since loading the page). This can be written more concisely using es6 syntax:
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
