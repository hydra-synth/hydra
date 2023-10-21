a.setScale(10)
a.setBins(6)
a.setSmooth(1)
a.settings[0].cutoff = 1
a.settings[1].cutoff = 2
a.settings[2].cutoff = 4
a.settings[3].cutoff = 6
a.settings[4].cutoff = 8
a.settings[5].cutoff = 9

src(o0)
 .saturate(1.01)
 .scale(.999)
 .color(() => (Math.random() * 2.2),() => (Math.random() * 0.5),() => (Math.random() * 2.6))
 .hue(.01)
 .modulateHue(src(o1).hue(.3).posterize(-1).contrast(.7),2)
 .layer(src(o1)
 .luma()
 .mult(gradient(1)
 .saturate(.9)))
 .diff(o2)
 .out(o0)

noise(1, .2)
  .rotate(2,.5)
  .layer(src(o0)
  .scrollX(.2))
  .out(o1)

osc(30,0.01,0.5)
.mult(osc(20,-0.1,1).modulate(noise(3,1)).rotate(() => Math.floor(Math.random() * a.fft[(Math.floor(Math.random() * 5))])))
.posterize([13,10,2].fast(0.5).smooth(1))
.modulateRotate(o0, () => (a.fft[0] * time * a.fft[(Math.floor(Math.random() * 5))]) * (time * a.fft[(Math.floor(Math.random() * 5))]) ).color(0.2,0,0.12)
.out(o2)

shape(50,[0.72,0.68,0.66,0.62,0.6,0.656,0.65,0.548,0.546,0.545,0.541,0.438,0.436,0.432,0.43,0.427,0.425].smooth(1))
  .colorama(1)
  .modulate(noise(6,[0.2,0.3,0.4].smooth(1)),0.15)
  .diff( src(o0).rotate(-.2,-.2) )
  .repeat(9,3,[.1,.2,.3,.4,.5].smooth(1), [.1,.2,.3,.4,.5].smooth(1))
  .rotate(.2,.2)
  .modulate(noise(18,[0.1,0.2,0.3,0.4].smooth(.2)))
  .diff(src(o0).modulate(noise(5,0.3)))
  //.saturate(0.6)
  //.color(1,0,1)
  .out(o3)

 // shape(50,0.72)
//	.scale(1.5,[0.25,0.5,0.75].fast(0.25),[3,2,1])
 //   .colorama(1)
//    .modulate(noise(6,[0.2,0.3,0.4].smooth(.61)),0.15)
 //   .blend(o0)
//  .out()

render(o3)
