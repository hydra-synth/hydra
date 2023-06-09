# Getting started

This document is an introduction to making live visuals using Hydra. It covers the basics of writing code in the browser to generate and mix live video sources. No coding or video experience is necessary! 

If you just want to start in 60 seconds you can also check:
* [Getting started short version](https://hackmd.io/@r08UjGF3QMCfvNmdjuY7iQ/rJCpsbNNc)

This tutorial is meant to be used from within the [hydra web editor](https://hydra.ojack.xyz/). It is also interactive -- you can directly modify the code in each code block to see how it affects the visuals.  

### Get to know the browser editor
To get started, open the the [hydra web editor](https://hydra.ojack.xyz/) in a separate window.   Close the top window by clicking the [x] in the top right. 

![](https://i.imgur.com/ZfgVjJZ.gif)

You will see some colorful visuals in the background with text on top in the top left of the screen. The text is code that generates the visuals behind it. 

At the right up corner you will find a toolbar with these buttons: 
![](https://i.imgur.com/iCG8Lrq.png)
1. **run all code** Runs all code on the page (same as typing *ctrl+shift+enter)
2. **upload to gallery** upload a sketch to Hydra's gallery and create a shorter URL
3. **clear all** resets the environment and clears text from the editor
4. **show random sketch**. Loads random sketch examples. Always it is a good way to learn Hydra by studying someone elses code.
5. **make random change** **dices** modify values automatically. Try it with some of the sketch examples.
6. **show info window** show overlay window with help text and links


## First line of code

Use the ***clear all button*** <img src="https://i.imgur.com/zQLjhBs.png" alt="drawing" width="40" style="display:inline;vertical-align:middle;"/>
to erase the previous sketch.

Then, type or paste the following in the editor:
```javascript
osc().out()
```
Press the ***run button***  <img src="https://i.imgur.com/sm5d3VX.png" alt="drawing" width="40" style="display:inline;vertical-align:middle;"/> to run this code and update the visuals on the screen. You should see some scrolling stripes appear in the background.

```hydra
osc().out()
```

This creates a visual oscillator. Try modifying the parameters of the oscillator by putting a number inside the parentheses of `osc()`, for example ```osc(10).out()```.

Re-run the code by pressing the ***run button*** again, and seeing the visuals update. Try adding other values to control the oscillator's `frequency`, `sync`, and `color offset`.

```hydra
osc(5, -0.126, 0.514).out()
```


*Trick: you can also use the keyboard shortcut **‘ctrl + shift + enter’** to have the same effect as the run button.*


## Adding transformations
We can add another transformation to the oscillator from above, by adding the function `rotate()` after the oscillator:
```hydra
osc(5,-0.126,0.514).rotate().out()
```

As you can see, you have first an input source `osc()` and things that come after (`rotate()` and `out()`) are connected with a dot ‘.’
In this sense, Hydra is inspired by [modular synthesis](https://en.wikipedia.org/wiki/Modular_synthesizer).
Instead of connecting cables you connect different kinds of javascript functions.  
![](https://i.imgur.com/RBRxeiL.jpg)
###### source [Sandin Image Processor](https://en.wikipedia.org/wiki/Sandin_Image_Processor)

You can continue adding transformations to this chain of functions. For example:  
```hydra
osc(5,-0.126,0.514).rotate(0, 0.2).kaleid().out()
```

Repeat: 
```hydra
osc(5,-0.126,0.514).rotate(0, 0.2).kaleid().repeat().out()
```


For more available sources and transformations, see the [interactive function reference](https://hydra.ojack.xyz/api). 
The logic is to start with a ***source*** (such as `osc()`, `shape()`, or `noise()`), and then add transformations to ***geometry*** and ***color*** (such as `.rotate()`, `.kaleid()`, `.pixelate()` ), and in the end always connect the chain of transformations to the output screen `.out()` .


```hydra
noise(4).color(-2, 1).colorama().out()
```

```hydra
shape(3).repeat(3, 2).scrollX(0, 0.1).out()
```


## What is an error? 
Sometimes, you will try to run a line of code, and nothing will happen. If you have an error you’ll notice text in red at the left-bottom on your screen. Something like ‘Unexpected token ‘.’ (in red) will appear. This doesn’t affect your code, but you won’t be able to continue coding until you fix the error. Usually it is a typing error or something related to the syntax. 

## What is a comment?

```javascript
// Hello I’m a comment line. I’m a text that won’t change your code. You can write notations, your name or even a poem here.
```

## Save your sketch on the internet


When you evaluate the entire code with the ***run button*** or with `shift + ctrl + enter`, Hydra automatically generates a URL that contains the last changes of your sketch. You can copy and paste the url from the URL bar to save it or share it with other people. You can also use the browser `back` and `forward` arrows to navigate to earlier versions of your sketch. 
![](https://i.imgur.com/lV0rmoh.png)


## Using the webcam
In addition to using sources from within hydra (such as `osc()` and `shape()`), you can use hydra to process external video sources such as a webcam. To initialize the webcam, run the following code:
```javascript
s0.initCam()
```

This activates the webcam source inside a variable called `s0`, and you should see the light on your webcam light up. However, you will still not see the webcam image on the screen. In order to use the camera within a hydra sketch, you need to use it within the `src()` function. 

```hydra
s0.initCam() //initialize webcam as external source 's0'
src(s0).out() // use external source 's0' inside Hydra
```

Similar to adding transformations above, you can add transformations of color and geometry to the camera output, by adding functions to the chain:

```hydra
s0.initCam()
src(s0).color(-1, 1).out()
```

```hydra
s0.initCam()
src(s0).color(-1, 1).kaleid().out()
```

If you have multiple webcams, you can access separate cameras by adding a number inside `initCam`, for example `s0.initCam(1)` or `s0.initCam(2)`. 




## Multiple outputs 

By default, hydra contains four separate virtual outputs that can each render different visuals, and can be mixed with each other to create more complex visuals. The variables `o0`, `o1`, `o2`, and `o3` correspond to the different outputs. 

To see all four of the outputs at once, use the `render()` function. This will divide the screen into four, showing each output in a different section of the screen. 

![](https://i.imgur.com/m5Q0Na6.jpg)

Using a different variable inside the `.out()` function renders the chain to a different output. For example, `.out(o1)` will render a function chain to graphics buffer `o1`. 


```hydra
gradient(1).out(o0) // render a gradient to output o0
osc().out(o1) // render voronoi to output o1
voronoi().out(o2) // render voronoi to output o2
noise().out(o3)  // render noise to output o3

render()  // show all outputs
```

By default, only output `o0` is rendered to the screen, while the `render()` command divides the screen in four. Show a specific output on the screen by adding it inside of `render()`, for example `render(o2)` to show buffer `o2`.


```hydra
gradient(1).out(o0) // render a gradient to output o0
osc().out(o1) // render voronoi to output o1
voronoi().out(o2) // render voronoi to output o2
noise().out(o3)  // render noise to output o3

render(o2)  // show only output o2
```


*Trick: try to create different sketches and switch them in your live performance or even combine them.*


```hydra
gradient(1).out(o0)
osc().out(o1)
render(o0) //switch render output
// render(o1) 
```

## Blending multiple visual sources together
You can use ***blend*** functions to combine multiple visual sources. `.blend()` combines the colors from two sources to create a third source. 

```hydra
s0.initCam()

src(s0).out(o0) // render the webcam to output o0

osc(10).out(o1) // render an oscillator to output o1

src(o0).blend(o1).out(o2) // start with o0, mix it with o1, and send it out to o2

render() // render all four outputs at once
```

Try adding transformations to the above sources (such as `osc(10).rotate(0, 0.1).out(o1)`) to see how it affects the combined image. You can also specify the amount of blending by adding a separate parameter to `.blend()`, for example `.blend(o1, 0.9)`. 

There are multiple [blend modes](https://en.wikipedia.org/wiki/Blend_modes) in hydra, similar to blend modes you might find in a graphics program such as photoshop or gimp. See [the function reference](https://hydra.ojack.xyz/api/) for more possibilities. 

```hydra
s0.initCam()

src(s0).out(o0) // render the webcam to output o0

osc(10).out(o1) // render an oscillator to output o1

src(o0).diff(o1).out(o2) // combine different signals by color difference (dark portions become inverted).

render() // render all four outputs at once
```


## Modulation
While ***blend*** functions combine the colors from two visual sources, ***modulate*** functions use the colors from one source to affect the ***geometry*** of the second source. This creates a sort of warping or distorting effect. An analogy in the real world would be looking through a texture glass window.
`modulate()` does not change color or luminosity but distorts one visual source using another visual source.

Using the same sources from above, we can use an oscillator to modulate or warp the camera image: 

```hydra
s0.initCam()

src(s0).out(o0) // render the webcam to output o0
osc(10).out(o1) // render an oscillator to output o1

src(o0).modulate(o1).out(o2) // use source o1 to distort source o0, lighter areas are distorted more

render() // render all four outputs at once
```

You can add a second parameter to the `modulate()` function to control the amount of warping:  `modulate(o1, 0.9)`. In this case, the red and green channels of the oscillator are being converted to x and y displacement of the camera image. 

All ***geometry*** transformations have corresponding ***modulate*** functions that allow you to use one source to warp another source. For example, `.modulateRotate()` is similar to `.rotate()`, but it allows you to apply different amounts of rotation to different parts of the visual source. See [the function reference](https://hydra.ojack.xyz/api/) for more examples. 

```hydra
s0.initCam()

src(s0).out(o0) // render the webcam to output o0
osc(10).out(o1) // render an oscillator to output o1

src(o0).modulateRotate(o1, 2).out(o2) // 

render() // render all four outputs at once
```

## More blending and modulating

In addition to using multiple outputs to combine visuals, you can also combine multiple sources within the same function chain, without rendering them to separate outputs.

```hydra
osc(10, 0.1, 1.2).blend(noise(3)).out(o0)

render(o0) // render output o0
```

This allows you to use many sources, blend modes, and modulation, all from within the same chain of functions. 

```hydra
osc(10, 0.1, 1.2).blend(noise(3)).diff(shape(4, 0.6).rotate(0, 0.1)).out()
```

*Trick: use `ctrl + shift + f` from the web editor to auto-format your code*

#### Modulating with the camera
```hydra
s0.initCam() //loads a camera

shape().modulate(src(s0)).out() //shape modulated by a camera
```
```hydra
s0.initCam() //loads a camera

src(s0).modulate(shape()).out() //camera modulated by a shape
```






```hydra

noise().out(o1)
shape().out(o3)

src(o1).add(src(o3)).out(o2) //additive light. Color only gets brighter

render() 
```

```hydra
osc(10).out(o0)

shape().out(o1)

src(o0).diff(o1).out(o2) // combines different signals by color difference (color negative/inverted/opposite).  

render()
```
```hydra
osc().mult(src(o1)).out() // multiplies the sources together, 
shape(5).out(o1)

```


We have now covered all of the basic types of functions within hydra: ***source***, ***geometry***, ***color***, ***blending***, and ***modulation***! See what you can come up with by mixing these together. 


#### Have fun!


