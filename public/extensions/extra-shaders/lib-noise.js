// licensed with GNU AFFERO GENERAL PUBLIC LICENSE Version 3
// author: Thomas Jourdan
setFunction({
  name: 'whitenoise',
  type: 'src',
  inputs: [
    {name: 'size',    type: 'float', default: 10.0},
    {name: 'dynamic', type: 'float', default:  0.0},
  ],
  glsl: `
  // see: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
  const highp float a = 12.9898;
  const highp float b = 78.233;
  const highp float c = 43758.5453;
  highp float dt = dot(floor((_st * resolution) / size), vec2(dynamic*time) + vec2(a ,b));
  highp float sn = mod(dt, 3.141592653589793);
  highp float d = fract(sin(sn) * c);
  return vec4(d, d, d, 1);
`})
setFunction({
  name: 'colornoise',
  type: 'src',
  inputs: [
    {name: 'size',    type: 'float', default: 10.0},
    {name: 'dynamic', type: 'float', default:  0.0},
  ],
  glsl: `
  highp float rr;
  highp float gg;
  highp float bb;
  // see: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
  {
  const highp float a = 12.9898;
  const highp float b = 78.233;
  const highp float c = 43758.5453;
  highp float dt = dot(floor((_st * resolution) / size), vec2(dynamic*time) + vec2(a ,b));
  highp float sn= mod(dt, 3.141592653589793);
  rr = fract(sin(sn) * c);
  }
  {
  const highp float a = 12.9898;
  const highp float b = 78.233;
  const highp float c = 43758.5453;
  highp float dt = dot(floor((_st * resolution) / size) + vec2(0.123, 0.567), vec2(dynamic*time) + vec2(a ,b));
  highp float sn = mod(dt, 3.141592653589793);
  gg = fract(sin(sn) * c);
  }
  {
  const highp float a = 12.9898;
  const highp float b = 78.233;
  const highp float c = 43758.5453;
  highp float dt = dot(floor((_st * resolution) / size) + vec2(0.543, 0.905), vec2(dynamic*time) + vec2(a ,b));
  highp float sn = mod(dt, 3.141592653589793);
  bb = fract(sin(sn) * c);
  }
  return vec4(rr, gg, bb, 1);
`})
setFunction({
  name: 'unoise',
  type: 'src',
  inputs: [
    {name: 'scale',   type: 'float', default: 10.0},
    {name: 'offset',  type: 'float', default:  0.1},
  ],
  glsl: `
  float noi = _noise(vec3(_st*scale, offset*time));
  noi = 0.5 + 0.5 * noi;
  return vec4(noi, noi, noi, 1.0);
`})
setFunction({
  name: 'turb',
  type: 'src',
  inputs: [
    {name: 'scale',   type: 'float', default: 10.0},
    {name: 'offset',  type: 'float', default:  0.1},
    {name: 'octaves', type: 'float', default:  3.0},
  ],
  glsl: `
  int on = int(abs(octaves));
  float fr = fract(octaves);
  vec2 pos = scale * _st;
  float sc = 1.0;
  float fbm = 0.0;
  for (int io = 0; io<8; io++) {
    fbm += sc * _noise(vec3(pos, offset * time));
    pos *= 2.0;
    sc /= 2.0;
    if(io >= on) break;
  }
  fbm += fr * sc * _noise(vec3(pos, offset * time));
  return vec4(fbm, fbm, fbm, 1.0);
`})
setFunction({
  name: 'uturb',
  type: 'src',
  inputs: [
    {name: 'scale',   type: 'float', default: 10.0},
    {name: 'offset',  type: 'float', default:  0.1},
    {name: 'octaves', type: 'float', default:  3.0},
  ],
  glsl: `
  int on = int(abs(octaves));
  float fr = fract(octaves);
  vec2 pos = scale * _st;
  float sc = 1.0;
  float fbm = 0.0;
  for (int io = 0; io<8; io++) {
    fbm += sc*_noise(vec3(pos, offset*time));
    pos *= 2.0;
    sc /= 2.0;
    if(io >= on) break;
  }
  fbm += fr * sc * _noise(vec3(pos, offset * time));
  fbm = 0.5 + 0.5 * fbm;
  return vec4(fbm, fbm, fbm, 1.0);
`})
// inspired by Inigo Quilez: domain warping - 2002
// see: https://www.iquilezles.org/www/articles/warp/warp.htm
setFunction({
  name: 'warp',
  type: 'src',
  inputs: [
    {name: 'scalei',       type: 'float', default: 10.0},
    {name: 'offset',       type: 'float', default:  0.1},
    {name: 'octaves',      type: 'float', default:  2.0},
    {name: 'octavesinner', type: 'float', default:  3.0},
    {name: 'scale',        type: 'float', default:  1.0},
  ],
  glsl: `
  int oin = int(abs(octavesinner));
  float fri = fract(octavesinner);
  float fbmx = 0.0;
  {
  vec2 pos = scalei * _st;
  float sc = 1.0;
  for (int io = 0; io<8; io++) {
    fbmx += sc * _noise(vec3(pos, offset * time));
    pos *= 2.0;
    sc /= 2.0;
    if(io >= oin) break;
  }
  fbmx += fri * sc * _noise(vec3(pos, offset * time));
  }
  float fbmy = 0.0;
  {
  vec2 pos = scalei * (_st + vec2(5.123, 3.987));
  float sc = 1.0;
  for (int io = 0; io<8; io++) {
    fbmy += sc * _noise(vec3(pos, offset * time));
    pos *= 2.0;
    sc /= 2.0;
    if(io >= oin) break;
  }
  fbmy += fri * sc * _noise(vec3(pos, offset * time));
  }
  int on = int(abs(octaves));
  float fr = fract(octaves);
  float fbm = 0.0;
  vec2 pos = scale * vec2(fbmx, fbmy);
  float sc = 1.0;
  for (int io = 0; io<8; io++) {
    fbm += sc * _noise(vec3(pos, offset * time));
    pos *= 2.0;
    sc /= 2.0;
    if(io >= on) break;
  }
  fbm += fr * sc * _noise(vec3(pos, offset * time));
  return vec4(fbm, fbm, fbm, 1.0);
`})
setFunction({
  name: 'cwarp',
  type: 'src',
  inputs: [
    {name: 'scalei',       type: 'float', default: 10.0},
    {name: 'offset',       type: 'float', default:  0.1},
    {name: 'octaves',      type: 'float', default:  2.0},
    {name: 'octavesinner', type: 'float', default:  3.0},
    {name: 'scale',        type: 'float', default:  1.0},
    {name: 'focus',        type: 'float', default:  0.5},
  ],
  glsl: `
  #define FOCUS pow(r, abs(focus))
  float r = length(vec2(_st.y-0.5, _st.x-0.5));
  int oin = int(abs(octavesinner));
  float fri = fract(octavesinner);
  float fbmx = 0.0;
  {
  vec2 pos = scalei * _st;
  float sc = 1.0;
  for (int io = 0; io<8; io++) {
    fbmx += sc * _noise(vec3(pos, offset * time));
    pos *= 2.0;
    sc /= 2.0;
    if(io >= oin) break;
  }
  fbmx += fri * sc * _noise(vec3(pos, offset * time));
  fbmx = (0.5 + 0.5 * fbmx) - FOCUS;
  }
  float fbmy = 0.0;
  {
  vec2 pos = scalei * (_st + vec2(5.123, 3.987));
  float sc = 1.0;
  for (int io = 0; io<8; io++) {
    fbmy += sc * _noise(vec3(pos, offset * time));
    pos *= 2.0;
    sc /= 2.0;
    if(io >= oin) break;
  }
  fbmy += fri * sc * _noise(vec3(pos, offset * time));
  fbmy = (0.5 + 0.5 * fbmy) - FOCUS;
  }
  int on = int(abs(octaves));
  float fr = fract(octaves);
  float fbm = 0.0;
  vec2 pos = scale * vec2(fbmx, fbmy);
  float sc = 1.0;
  for (int io = 0; io<8; io++) {
    fbm += sc*_noise(vec3(pos, offset*time));
    pos *= 2.0;
    sc /= 2.0;
    if(io >= on) break;
  }
  fbm += fr * sc * _noise(vec3(pos, offset * time));
  fbm = (0.5 + 0.5 * fbm) - FOCUS;
  return vec4(fbm, fbm, fbm, 1.0);
`})
setFunction({
  name: 'ncontour',
  type: 'src',
  inputs: [
    {name: 'thresh',  type: 'float', default: 0.5},
    {name: 'smooth',  type: 'float', default: 0.1},
    {name: 'octaves', type: 'int',   default: 3},
    {name: 'scale',   type: 'float', default: 5.0},
    {name: 'speed',   type: 'float', default: 0.5},
    {name: 'step',    type: 'float', default: 2.0},
  ],
  glsl: `
  vec2 st = _st - 0.5;
  float d0 = _noise(vec3(st*scale, speed*time));
  for(int ni=1; ni < 5; ++ni) {
    if(ni >= octaves)
      break;
    speed /= step;
    scale *= step;
    d0 += _noise(vec3(st*scale, speed*time));
  }
  float d = distance(d0, thresh);
  float g = smoothstep(0.0, smooth, d);
  return vec4(vec3(g, g, g), 1.0);
`})
