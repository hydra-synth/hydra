## Tutorial

Go to https://hydra-editor.glitch.me

* CTRL-Enter: run a line of code
* CTRL-Shift-Enter: run all code on screen
* ALT-Enter: run a block
* CTRL-Shift-H: hide or show code
* CTRL-Shift-S: Save screenshot and download as local file
* CTRL-Shift-G: Share to twitter (if available). Shares to [@hydra_patterns](https://twitter.com/hydra_patterns)

All code can be run either from the in-browser text editor or from the browser console.

Check [@hydra_patterns](https://twitter.com/hydra_patterns) for patterns folks have shared as an easy way to get started.

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
s0.initCam() // initialize a webcam in source buffer s0
src(s0).out() // render source buffer s0
```
If you have more than one camera connected, you can select the camera using an index:
```
s0.initCam(1) // initialize a webcam in source buffer s0
```
webcam kaleidoscope:
```
s0.initCam() // initialize a webcam in source buffer s0
src(s0).kaleid(4).out() // render the webcam to a kaleidoscope
```

You can also composite multiple sources together:
```
osc(10)
  .rotate(0.5)
  .diff(osc(200))
  .out()
```

By default, the environment contains four separate output buffers that can each render different graphics.  The outputs are accessed by the variables o0, o1, o2, and o3.

to render to output buffer o1:
```
osc().out(o1)
render(o1) // render the contents of o1
```
If no output is specified in out(), the graphics are rendered to buffer o0.
to show all render buffers at once:
```
render()
```

The output buffers can then be mixed and composited to produce what is shown on the screen.
```
s0.initCam() // initialize a webcam in source buffer s0
src(s0).out(o0) // set the source of o0 to render the buffer containing the webcam
osc(10, 0.2, 0.8).diff(o0).out(o1) // initialize a gradient in output buffer o1, composite with the contents of o0
render(o1) // render o1 to the screen
```

The composite functions blend(), diff(), mult(), and add() perform arithmetic operations to combine the input texture color with the base texture color, similar to photoshop blend modes.

modulate(texture, amount) uses the red and green channels of the input texture to modify the x and y coordinates of the base texture. More about modulation at: https://lumen-app.com/guide/modulation/
```
osc(21, 0).modulate(o1).out(o0)
osc(40).rotate(1.57).out(o1)
```
