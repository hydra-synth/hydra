s0.initCam()

src(s0).invert(0.3).modulate(noise(18,3), 3).diff(s0).rotate(2, [0.2, 0.2, 0.2, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0,0,0,0,0,0, -0.1, -0.1,-0.1,-0.1,-0.1, -0.2,-0.2,-0.2,-0.2,-0.2,-0.2].smooth(0.3)).out(o3)

shape(4, 10)
  .colorama(1)
  .modulate(noise(3,0.2),0.1)
  .blend(o2)
  .blend(o2)
  .blend(o2)
  .blend(o2)
  .brightness(0.1)
  .color(0.1,0.1,0.1)
  .out(o0)

shape(50,[0.72,0.68,0.66,0.62,0.6,0.56,0.5,0.48,0.46,0.45,0.41,0.38,0.36,0.32,0.3,0.27,0.25].smooth(1))
  .colorama(1)
  .modulate(noise(3,0.2),0.15)
  .blend(o2)
  .blend(o2)
  .blend(o2)
  .blend(o2)
  .diff(o3)
  .out(o1)

src(o0).diff(o1).posterize([30,5,20,10].smooth(1) , 0.5).out(o2)

render(o2)
