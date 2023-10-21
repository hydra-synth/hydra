function z(n) {
  return Math.floor(Math.random() * n) + 0.7
}
function y(n) {
  return parseFloat(`0.${"0".repeat(Math.trunc(modTime()).toString().length - 1)}${n}`)
}
function x(n) {
  return parseFloat((Math.trunc(modTime()) * y(n)))
}
function modTime() {
  return time % z(10)
}

a.setScale(4)
a.setBins(4)
a.setSmooth(0.8)

a.settings[0].cutoff = 1
a.settings[1].cutoff = 2
a.settings[2].cutoff = 3
a.settings[3].cutoff = 4

shape(50,() => x(z(a.fft[3] + a.fft[1])))
  .colorama(1)
  .modulate(noise(20,0.2),0.5)
  .brightness(() => modTime() * 0.05 ) // 0.22
  .color(1,0.2,0.4)
  .rotate(2, 0.1) // 0.1
  .out(o0)

shape(50,() => x(z(a.fft[2] + a.fft[0])))
  .colorama(1)
  .modulate(noise(24,0.2),0.1)
  .brightness(() => modTime() * 0.05 ) // 0.22
  .color(1,0.2,0.4)
  .rotate(-2,  -0.2) // -0.2
  .out(o1)

shape(50,() => x(z(a.fft[0] + a.fft[1])))
  .colorama(1)
  .modulate(noise(28,0.2),0.2)
  .brightness(() => modTime() * 0.05 ) // 0.22
  .color(1,0.2,0.4)
  .rotate(2, -0.1) // -0.21
  .out(o2)

src(o0).diff(o1).diff(o2).posterize([30,5,20,10].smooth(1) , 0.5).out(o3)

render(o3)
