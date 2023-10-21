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

shape(50,() => x(z(7)))
  .colorama(1)
  .modulate(noise(3,0.2),0.1)
  .blend(o2)
  .blend(o2)
  .blend(o2)
  .blend(o2)
  .brightness(0.1)
  .color(1,0.4,0.2)
  .out(o0)

shape(50,() => x(z(4)))
  .colorama(1)
  .modulate(noise(3,0.2),0.15)
  .blend(o2)
  .blend(o2)
  .blend(o2)
  .blend(o2)
  .out(o1)

src(o0).diff(o1).posterize([30,5,20,10].smooth(1) , 0.5).out(o2)

render(o2)
