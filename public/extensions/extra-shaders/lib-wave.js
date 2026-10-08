// licensed with GNU AFFERO GENERAL PUBLIC LICENSE Version 3
// author: Thomas Jourdan
setFunction({
  name: 'squ',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 0.1,
    },
  ],
  glsl: `
  float d = floor(0.5+fract((_st.x + time * speed) * frequency));
  return vec4(d, d, d, 1.0);
`})
setFunction({
  name: 'usin',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 0.1,
    },
  ],
  glsl: `
  float d = 0.5+0.5*sin((_st.x + time * speed) * frequency * 6.283185307179586);
  return vec4(d, d, d, 1.0);
`})
setFunction({
  name: 'saw',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 0.1,
    },
  ],
  glsl: `
  float d = fract((_st.x + time * speed) * frequency);
  return vec4(d, d, d, 1.0);
`})
setFunction({
  name: 'harmonic',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 0.1,
    },
    {
      type: 'float',
      name: 'phase1',
      default: 0.0,
    },
    {
      type: 'float',
      name: 'phase2',
      default: 0.0,
    },
  ],
  glsl: `
  float d0 = sin((_st.x + time * speed) * frequency);
  float d1 = sin((_st.x + phase1 + time * speed) * 2.0 * frequency);
  float d2 = sin((_st.x + phase2 + time * speed) * 4.0 * frequency);
  float d = 0.5 * (0.5714285714285714 * d0 + 0.2857142857142857 * d1 + 0.2857142857142857 * d2) + 0.5;
  return vec4(d, d, d, 1.0);
`})
setFunction({
  name: 'tri',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 0.1,
    },
  ],
  glsl: `
  float c = abs(mod(1.0+(_st.x + time * speed) * 2.0 * frequency, 2.0) - 1.0);
 return vec4(c, c, c, 1.0);
`})
// licensed with GNU AFFERO GENERAL PUBLIC LICENSE Version 3
// author: Thomas Jourdan
setFunction({
  name: 'rsqu',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 0.1,
    },
  ],
  glsl: `
  float d = floor(0.5+fract((distance(_st, vec2(0.5,0.5)) + time * speed) * frequency));
  return vec4(d, d, d, 1.0);
`})
setFunction({
  name: 'rusin',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 0.1,
    },
  ],
  glsl: `
  float d = 0.5+0.5*sin((distance(_st, vec2(0.5,0.5)) + time * speed) * frequency * 6.283185307179586);
  return vec4(d, d, d, 1.0);
`})
setFunction({
  name: 'rsaw',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 0.1,
    },
  ],
  glsl: `
  float d = fract((distance(_st, vec2(0.5,0.5)) + time * speed) * frequency);
  return vec4(d, d, d, 1.0);
`})
setFunction({
  name: 'rharmonic',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 0.1,
    },
    {
      type: 'float',
      name: 'phase1',
      default: 0.0,
    },
    {
      type: 'float',
      name: 'phase2',
      default: 0.0,
    },
  ],
  glsl: `
  float di = distance(_st, vec2(0.5,0.5));
  float d0 = sin((di + time * speed) * frequency);
  float d1 = sin((di + phase1 + time * speed) * 2.0 * frequency);
  float d2 = sin((di + phase2 + time * speed) * 4.0 * frequency);
  float d = 0.5 * (0.5714285714285714 * d0 + 0.2857142857142857 * d1 + 0.2857142857142857 * d2) + 0.5;
  return vec4(d, d, d, 1.0);
`})
setFunction({
  name: 'rtri',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 0.1,
    },
  ],
  glsl: `
  float c = abs(mod(1.0+(distance(_st, vec2(0.5,0.5)) + time * speed) * 2.0 * frequency, 2.0) - 1.0);
  return vec4(c, c, c, 1.0);
`})
setFunction({
  name: 'stripes',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 1,
    },
  ],
  glsl: `
  // float d = floor((_st.x + time * speed) * frequency) / frequency;
  float d = fract(floor(_st.x * frequency) / frequency + time * speed);
  return vec4(d, d, d, 1.0);
`})
setFunction({
  name: 'rstripes',
  type: 'src',
  inputs: [
    {
      type: 'float',
      name: 'frequency',
      default: 10,
    },
    {
      type: 'float',
      name: 'speed',
      default: 1,
    },
  ],
  glsl: `
  // float d = floor((_st.x + time * speed) * frequency) / frequency;
  float d = fract(floor(distance(_st, vec2(0.5, 0.5)) * frequency) / frequency + time * speed);
  return vec4(d, d, d, 1.0);
`})
