// licensed with GNU AFFERO GENERAL PUBLIC LICENSE Version 3
// author: Thomas Jourdan
setFunction({
    name: 'ifpos',
    type: 'combine',
    inputs: [
      {name: 'value',    type: 'float', default: 1.0},
    ],
    glsl: `
    return value < 0.0 ? _c0 : _c1;
  `})
setFunction({
    name: 'ifeven',
    type: 'combine',
    inputs: [
      {name: 'value',  type: 'float', default: 0.0},
      {name: 'eps',    type: 'float', default: 0.01},
    ],
    glsl: `
    return abs(mod(floor(value), 2.0)) < eps ? _c0 : _c1;
  `})
  setFunction({
      name: 'ifzero',
      type: 'combine',
      inputs: [
        {name: 'value',  type: 'float', default: 0.0},
        {name: 'eps',    type: 'float', default: 0.1},
      ],
      glsl: `
      return abs(value) < eps ? _c0 : _c1;
    `})
setFunction({
    name: 'splitview',
    type: 'combine',
    inputs: [
      {name: 'where',  type: 'float', default: 0.5},
    ],
    glsl: `
    return gl_FragCoord.x/resolution.x > where ? _c0 : _c1;
  `})
setFunction({
    name: 'splitviewh',
    type: 'combine',
    inputs: [
      {name: 'where',  type: 'float', default: 0.5},
    ],
    glsl: `
    return gl_FragCoord.y/resolution.y > where ? _c0 : _c1;
  `})
