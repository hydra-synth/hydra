a.setScale(10)
a.setBins(6)
a.setSmooth(0.8)
a.settings[0].cutoff = 1
a.settings[1].cutoff = 2
a.settings[2].cutoff = 4
a.settings[3].cutoff = 6
a.settings[4].cutoff = 8
a.settings[5].cutoff = 9

src(o0)
 .saturate(1.01)
 .scale(.999)
 .color(() => (Math.random() * 2),() => (Math.random() * 1),() => (Math.random() * 2))
 .hue(.01)
 .modulateHue(src(o1).hue(.3).posterize(-1).contrast(.7),2)
  .layer(src(o1)
         .luma()
         .mult(gradient(1)
               .saturate(.9))).diff(o2)
  .out(o0)

noise(1, .2)
  .rotate(2,.5)
  .layer(src(o0)
  .scrollX(.2))
  .out(o1)

osc(30,0.01,0.5)
.mult(osc(20,-0.1,1).modulate(noise(3,1)).rotate(() => Math.floor(Math.random() * a.fft[(Math.floor(Math.random() * 5))])))
.posterize([13,10,2].fast(0.5).smooth(1))
.modulateRotate(o0, () => (a.fft[0] * time * a.fft[(Math.floor(Math.random() * 5))]) * (time * a.fft[(Math.floor(Math.random() * 5))]) ).color(0.052,0,0.2)
.out(o2)

render(o0)
