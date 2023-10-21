a.setScale (10)
a.setBins (6)
a.setSmooth(0.99)
a.settings[0].cutoff = 1
a.settings[1].cutoff = 2
a.settings[2].cutoff = 4
a.settings[3].cutoff = 6
a.settings[4].cutoff = 8
a.settings[5].cutoff = 9

pattern = (amount) => osc(200, 0).kaleid(200).scale(amount, amount).rotate(() => Math.round(time * 0.0001))
//
pattern(() => (Math.floor(time * a.fft[1]) * 0.1 + 0.55 ))
  .scrollX(0.1, 0.01).scrollY(0.1, 0.01).rotate(() => Math.floor(Math.random() * 2))
  .mult(pattern(() => (Math.floor(time * a.fft[1]) * 0.1 + 0.55 )))
  .posterize([18,40,27].fast(0.5).smooth(2))
  .modulate(noise(8,5))
  .diff(pattern(.55))
  .out()