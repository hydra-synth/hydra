a.setBins(6)
//
a.settings[0].cutoff = 1
a.settings[1].cutoff = 2
a.settings[2].cutoff = 4
a.settings[3].cutoff = 6
a.settings[4].cutoff = 8
a.settings[5].cutoff = 9
s0.initCam()
src(s0)
  .pixelate(20, 2)
  .modulate(noise(7.5), () => 4.9 * a.fft[0] * Math.random())
  .out(o1)
src(o1).modulate(o1, () => a.fft[3]).out(o2)
osc(() => a.fft[0] * time, 0.1, 0.1)
  .color(0.2, 0.5, 2.5)
  .rotate(() => a.fft[2], 0.1)
  .pixelate(2, 20)
  .modulate(noise(6.3), () => 2.1 * Math.sin(time * a.fft[1]))
  .diff(o2)
  .out(o0)
