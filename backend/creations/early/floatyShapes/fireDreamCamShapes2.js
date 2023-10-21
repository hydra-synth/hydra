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
src(s0).modulate(s0, () => (a.fft[0] * Math.random())).out(o1)
shape(3).scale(()=> a.fft[4]*2 +1).kaleid(9).add(osc(12).colorama(1).color(2,3,4)).blend(o0).color(0,1,1)
.blend(o0).rotate(()=> a.fft[1]*0.1 -0.2).scrollY(-0.32,-0.2)
.add(shape(() => (Math.floor(Math.random() * 15) + 5))
     .color(2.5,0.5,0.0).repeat(-3,3).add(shape(2).scale(1).kaleid(5).color(0,1,0.5)).scrollY(()=> a.fft[0]*0.7 -0.1,-0.02)).scale(()=> a.fft[2]*0.2 -1).modulate(o0, () => (a.fft[0] * Math.random()))
.scale(()=> a.fft[3]*2 -1).scrollY(-21,-0.2).rotate(-0.1,()=> a.fft[3]*0.02 -0.1).diff(o1).out(o0)