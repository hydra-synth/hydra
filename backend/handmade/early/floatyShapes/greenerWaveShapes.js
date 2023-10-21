a.setScale (10)
a.setBins (6)
//
a.settings[0].cutoff = 1
a.settings[1].cutoff = 2
a.settings[2].cutoff = 4
a.settings[3].cutoff = 6
a.settings[4].cutoff = 8
a.settings[5].cutoff = 9
s0.initCam()

shape(()=>Math.sin(time / Math.PI)+1*3, () => time * 0.0001,() => Math.random() * .16).color(1.8,0,0.3)
.repeat(5,3, ()=>a.fft[0]*2, ()=>a.fft[1]*2)
.scrollY(.5,0.1)
.layer(
  src(o1)
  .mask(o0)
  .luma(0.1, .1)
  .invert(.2)
)
.modulate(o1,.02)
.out(o0)

osc(() => (a.fft[2] * Math.random() + 80), 0.09, 0.1)
.color(1.84,0.12,0.74)
.modulate(osc(8).rotate(1, 0.5))
.rotate(1, 0.2)
.out(o1)

src(s0).modulateScale(s0, () => ((a.fft[5] || a.fft[0]) * ((time/64)/(Math.PI+Math.PI)*(a.fft[Math.floor(Math.random())])))).out(o3)
shape(3).scale(()=> a.fft[4]*2 +1).kaleid(9).add(osc(12).colorama(0.5).color(0.1,0.1,0.5)).blend(o0).color(0.25,0.5,0.32)
.blend(o1).rotate(()=> a.fft[1]*0.1 -0.2).scrollY(-0.32,-0.2)
.add(shape(() => (Math.floor(Math.random() * 15) + 5))
     .color(0,0,0.70).repeat(-5,3).add(shape(2).scale(0.5).kaleid(4).color(0.9,0.1,0.40)).scrollY(()=> a.fft[0]*0.7 -0.1,-0.02)).scale(()=> a.fft[2]*0.2 -1).modulate(o0, () => (a.fft[0] * Math.random()))
.scale(()=> a.fft[3]*2 -1).scrollY(-21,-0.2).rotate(-0.1,()=> a.fft[3]*0.02 -0.1).diff(o3).diff(o0).out(o2)

render(o2)