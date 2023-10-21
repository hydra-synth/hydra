a.setScale(10)
a.setBins(6)
//
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
  const hrMin = hr + min / 60;
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
  const secMs = hr + min / 1000;
  if (secMs > 60) {
    return 60 - secMs;
  } else {
    return secMs;
  }
}

noise(6, 0.05)
  .mult(
    osc(
      9,
      0,
      () =>
        Math.sin(new Date().getSeconds() / 1.5) +
        2
    )
  )
  .mult(
    noise(9, 0.03)
      .brightness(1.2)
      .contrast(2)
      .mult(
        osc(9, 0, () => Math.sin(time / 3) + 13)
      )
  )
  .diff(
    voronoi(350, 0.15)
      .modulateScale(
        osc(8).rotate(Math.sin(time)),
        0.5
      )
      .thresh(0.8)
      .modulateRotate(osc(7), 0.4)
      .thresh(0.7)
      .diff(src(o0).scale(1.8))
      .modulateScale(
        osc(2).modulateRotate(o0, 0.74)
      )
      .diff(
        src(o0)
          .rotate([-0.012, 0.01, -0.002, 0])
          .scrollY(0, [-1 / 199800, 0].fast(0.7))
      )
      .brightness(
        [-0.02, -0.17].smooth().fast(0.5)
      )
  )
  .scale(() => Math.sin(time / 6.2) * 0.12 + 0.15)
  .modulateScale(
    osc(3, 0, 0)
      .mult(osc(3, 0, 0).rotate(3.14 / 2))
      .rotate(() => time / 25)
      .scale(0.39)
      .scale(1, 0.6, 1)
      .invert(),
    () => Math.sin(time / 5.3) * 1.5 + 3
  )
  .rotate(() => secondsArc() )
  .modulate(
    noise(() => hoursArc(), 0.2),
    0.15
  )
  .mult(shape(100, 0.9, 0.01).scale(1, 0.6, 1))
  .color(() => a.fft[0] + .25, 0, () => a.fft[2])
  .out();
