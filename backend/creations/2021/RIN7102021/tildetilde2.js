a.setScale (10)
a.setBins(6)
a.setSmooth(1)
a.settings[0].cutoff = 1
a.settings[1].cutoff = 2
a.settings[2].cutoff = 4
a.settings[3].cutoff = 6
a.settings[4].cutoff = 8
a.settings[5].cutoff = 9

osc(30,0.01,0.5)
.mult(osc(20,-0.1,1).modulate(noise(3,1)).rotate(() => Math.floor(Math.random() * a.fft[(Math.floor(Math.random() * 5))])))
.posterize([13,10,2].fast(0.5).smooth(1))
.modulateRotate(o0, () => (a.fft[0] * 128 * a.fft[(Math.floor(Math.random() * 5))]) * (128 * a.fft[(Math.floor(Math.random() * 5))]) ).color(1.21,.32,.642)
.out(o0)

noise(1, .2)
  .rotate(2,.5)
  .layer(src(o0)
  .scrollY(() => a.fft[1],() => a.fft[1])).scale(() => a.fft[1] + 0.01).diff(o0).modulateRotate(o0, () => Math.floor(Math.random() * 5))
  .out(o1)

render(o1)
