a.setScale(10) // set scale for audio between 0 and 10
a.setBins(6) // partition audio levels into 6 bins

a.settings[0].cutoff = 1
a.settings[1].cutoff = 2
a.settings[2].cutoff = 4
a.settings[3].cutoff = 6
a.settings[4].cutoff = 8
a.settings[5].cutoff = 9

function hoursArc() {
  const date = new Date();
  const min = date.getMinutes();
  const hr = date.getHours();
  const hrMin = hr + (min / 60);
  if (hrMin > 12) {
    return 24 - hrMin;
  } else {
    return hrMin;
  }
}

function secondsArc() {
  const date = new Date();
  const ms = date.getMilliseconds();
  const sec = date.getSeconds();
  const secMs = sec + (ms / 1000);
  if (secMs > 60) {
    return 60 - secMs;
  } else {
    return secMs;
  }
}

var fractionsOfTime = () => 1.9 * Math.sin(0.8 * time)
var secondsArcSin = () => Math.sin(secondsArc())
var timeScale = () => Math.sin(time / 12) * .0812 + 0.315
var modTimeScale = () => Math.sin(time / 5.3) * 1.5 + 3

var upAndDown = [0.8,0.9,1,1.1,1,0.9,0.8,0.7,0.6,0.5,0.6,0.7,0.8,0.9,1,1.1,1,0.9,0.8]
var oscPoint8 = osc(0.8).rotate(Math.sin(time))
var oscPoint7 = osc(0.7)
var osc2 = osc(2)
var oZeroScaleOnePointEight = src(o0).scale(1.8)
var oZeroRotateAndScrollY = src(o0).rotate([-0.012, 0.01, -0.002, 0]).scrollY(0, [-1 / 199800, 0].fast(0.7))
var voro = voronoi(350, 0.15)
var modScaleVoronoi = voro.modulateScale(oscPoint8, 0.5)
var msvThresAndModRotate = modScaleVoronoi.thresh(0.8).modulateRotate(oscPoint7, 0.4)

var spaceWarp = msvThresAndModRotate.diff(oZeroScaleOnePointEight)
                                    .modulateScale(osc2)
                                    .diff(oZeroRotateAndScrollY)
                                    .brightness([-0.02, -0.17].smooth().fast(0.5))

var multSpaceNoise = noise(6, 0.05).mult(spaceWarp)

var wavyGrid = osc(4, 0.1, 0.8).color(() => a.fft[2] + .32,0, -1.1)
                               .rotate(0.44, 0.2)
                               .pixelate(40, 12)
                               .modulate(noise(2.5))

var modNoiseOsc = osc(1.8, 0.1, 0.8).color(() => a.fft[0] + .42,0, .61)
                                    .rotate(0.31, 0.1).pixelate(12, 40)
                                    .modulate(noise(16))

var multOsc = osc(3, 0, 0).mult(osc(3, 0, 0)
                          .rotate(3.14 / 2))
                          .rotate(() => time / 25)
                          .scale(4.39)
                          .scale(1, 0.6, 1)
                          .invert()

var hoursNoise = noise(() => hoursArc(), 0.02)

var warpStorm = multSpaceNoise.mult(wavyGrid, () => fractionsOfTime())
                              .diff(modNoiseOsc, () => 2.1 * secondsArcSin())
                              .scale(() => timeScale())
                              .modulateScale(multOsc, () => modTimeScale())
                              .rotate(() => secondsArc() / 30)
                              .modulate(hoursNoise, () => hoursArc() * 0.15)

var x = warpStorm.modulate(noise(() => hoursArc()))
                 .modulate(o1)
                 .mult(shape(100, 0.9, 0.01)
                 .scale(upAndDown.smooth().fast(0.01), 0.55, 1)) // adjust 2nd param to -/+ width
                 .color(() => a.fft[0] + 0.6, 0, () => a.fft[2])

warpStorm.out(o0)
x.out(o1)
render(o1)