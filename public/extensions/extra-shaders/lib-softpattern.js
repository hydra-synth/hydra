// licensed with GNU AFFERO GENERAL PUBLIC LICENSE Version 3
// author: Thomas Jourdan
setFunction({
  name: 'blinking',
  type: 'src',
  inputs: [
    {name: 'tiles', type: 'float', default: 5.0},
    {name: 'scale', type: 'float', default: 5.0},
    {name: 'speed', type: 'float', default: 0.5},
    {name: 'phase', type: 'float', default: 0.03},
  ],
  glsl: `
  vec2 st = floor(_st*tiles)/tiles;
  float h = _noise(vec3((st+vec2(0.0, phase))*scale, speed*time));
  float s = 0.5 * _noise(vec3((st+vec2(phase, 0.0))*scale, speed*time)) + 0.5;
  float v = 0.5 * _noise(vec3((st+vec2(0.0, phase))*scale, speed*time)) + 0.5;
  v *= (1.0-tiles*distance(_st, st+0.5/tiles));
  return vec4(_hsvToRgb(vec3(h, s, v)), 1.0);
`})
setFunction({
  name: 'blobs',
  type: 'src',
  inputs: [
    {name: 'speed', type: 'float', default: 0.1},
    {name: 'tresh', type: 'float', default: 0.2},
    {name: 'soft',  type: 'float', default: 0.05},
  ],
  glsl: `
    float edge   = 0.2;
    float border = 0.05;
    float vv = 0.5;
    vec2 st = _st-0.5;
    int dir = 1;
    float speed0= speed * time;
    vv *= distance(st * 2.0,
                   vec2(cos(speed0), sin(speed0)));
    float speed1 = -2.0 * speed * time;
    vv *= distance(st * 2.0,
                   vec2(cos(speed1), sin(speed1)));
    float speed2 = 3.0 * speed * time;
    vv *= distance(st * 2.0,
                   vec2(cos(speed2), sin(speed2)));
    float gray = smoothstep(tresh-soft,
                            tresh+soft,
                            vv);
    return vec4(gray, gray, gray, 1.0);
`})
setFunction({
  name: 'concentric',
  type: 'src',
  inputs: [
    {name: 'base',     type: 'float', default: 5.0},
    {name: 'octaves',  type: 'float', default: 2.0},
    {name: 'ampscale', type: 'float', default: 0.5},
    {name: 'speed',    type: 'float', default: 1.0},
  ],
  glsl: `
  float r = base*length(_st - vec2(0.5));
  float d = 0.5*sin(r+speed*time) + 0.5;
  d += ampscale*(0.5*sin(r*octaves+speed*time) + 0.5);
  octaves *= octaves;
  ampscale *= ampscale;
  d += ampscale*(0.5*sin(r*octaves) + 0.5);
  octaves *= octaves;
  ampscale *= ampscale;
  d += ampscale*(0.5*sin(r*octaves+speed*time) + 0.5);
  return vec4(d, d, d, 1);
`})
setFunction({
  name: 'phasenoise',
  type: 'src',
  inputs: [
    {name: 'base',  type: 'float', default: 0.0},
    {name: 'range', type: 'float', default: 0.1},
    {name: 'scale', type: 'float', default: 5.0},
    {name: 'speed', type: 'float', default: 0.5},
    {name: 'phase', type: 'float', default: 0.03},
  ],
  glsl: `
  float h = range * _noise(vec3(_st*scale, speed*time)) + base;
  float s = 0.5 * _noise(vec3((_st+vec2(phase, 0.0))*scale, speed*time)) + 0.5;
  float v = 0.5 * _noise(vec3((_st+vec2(0.0, phase))*scale, speed*time)) + 0.5;
  return vec4(_hsvToRgb(vec3(h, s, v)), 1.0);
`})
setFunction({
  name: 'sdfmove',
  type: 'src',
  inputs: [
    {name: 'speed1',     type: 'float', default: 0.73},
    {name: 'speed2',     type: 'float', default: 1.0},
    {name: 'speed3',     type: 'float', default: -0.53},
  ],
  glsl: `
  vec2 st = _st;
  float d =  distance(vec2(fract(st.x+speed3*time), st.y), vec2(0.0, 0.1));
  d = min(d, distance(vec2(fract(st.x+speed2*time), st.y), vec2(0.0, 0.3)));
  d = min(d, distance(vec2(fract(st.x+speed1*time), st.y), vec2(0.0, 0.5)));
  d = min(d, distance(vec2(fract(st.x+speed2*time), st.y), vec2(0.0, 0.7)));
  d = min(d, distance(vec2(fract(st.x+speed3*time), st.y), vec2(0.0, 0.9)));
  d = pow(d, 0.4);
  return vec4(d, d, d, 1);
`})
setFunction({
  name: 'smoothsun',
  type: 'src',
  inputs: [
    {name: 'threshold', type: 'float', default: 0.3},
    {name: 'border',    type: 'float', default: 0.2},
    {name: 'speed',     type: 'float', default: 1.0},
    {name: 'ampscale',  type: 'float', default: 0.5},
  ],
  glsl: `
  float r = length(_st - vec2(0.5));
  float bscale = border;
  float nscale = 0.1;
  r += nscale * _noise(vec3(_st/nscale, speed*time));
  float d = smoothstep(threshold-bscale, threshold+bscale, r);
  
  bscale *= ampscale;
  nscale *= ampscale;
  r -= nscale * _noise(vec3(_st/nscale, speed*time));
  d -= 10.0 * nscale * smoothstep(threshold-bscale, threshold+bscale, r);
  
  bscale *= ampscale;
  nscale *= ampscale;
  r += nscale * _noise(vec3(_st/nscale, speed*time));
  d += 10.0 * nscale * smoothstep(threshold-bscale, threshold+bscale, r);

  d = pow(1.0 - clamp(d, 0.0, 1.0), 2.0);
  return vec4(d, d, d, 1);
`})
