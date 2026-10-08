// licensed with GNU AFFERO GENERAL PUBLIC LICENSE Version 3
// author: Thomas Jourdan
//
// see: Ebert, Musgrave, Peachey, Perlin Worley
// "Texturing and Modeling – A Procedural Approach"
setFunction({
  name: 'pulse',
  type: 'src',
  inputs: [
    {name: 'edge',    type: 'float', default: 0.5},
    {name: 'width',   type: 'float', default: 0.05},
    {name: 'epsilon', type: 'float', default: 0.001},
  ],
  glsl: `
    float ea = abs(epsilon);
    float wa = abs(width);
    float d0 = smoothstep(edge-ea, edge+ea, _st.x);
    float d1 = smoothstep(edge+wa-ea, edge+wa+ea, _st.x);
    float d = d0-d1;
    return vec4(d, d, d, 1);
`})
setFunction({
  name: 'pulsetrain',
  type: 'src',
  inputs: [
    {name: 'train',   type: 'float', default: 3.0},
    {name: 'edge',    type: 'float', default: 0.5},
    {name: 'width',   type: 'float', default: 0.05},
    {name: 'epsilon', type: 'float', default: 0.001},
  ],
  glsl: `
    float ea = abs(epsilon);
    float wa = abs(width);
    float xp = _st.x;
    float d = 0.0;
    int itr = int(train);
    for(int ii = 0; ii < 10; ii++) {
      float d0 = smoothstep(edge-ea, edge+ea, xp);
      float d1 = smoothstep(edge+wa-ea, edge+wa+ea, xp);
      if(ii >= itr) break;
      d += d0-d1;
      xp += 1.0 / float(itr);
    }
    return vec4(d, d, d, 1);
`})
// see: https://andrewhungblog.wordpress.com/2018/07/28/shader-art-tutorial-hexagonal-grids/
setFunction({
  name: 'hextile',
  type: 'src',
  inputs: [
    {name: 'tiles',   type: 'float', default: 10.0},
  ],
  glsl: `
  const vec2 s = vec2(1.0, sqrt(3.0));
  vec2 p = (_st - 0.5) * tiles;
  vec4 hC = floor(vec4(p, p - vec2(0.5, 1)) / s.xyxy) + 0.5;
  vec4 h = vec4(p - hC.xy*s, p - (hC.zw + 0.5) * s);
  float d = length(h.xy) < length(h.zw) ?
            fract(p.x*0.5) < 0.5 ? 0.75 : 0.0 :
            fract(p.x*0.5-s.y-0.01) < 0.5 ? 0.25 : 1.0;
  return vec4(d, d, d, 1);
`})
setFunction({
  name: 'checker',
  type: 'src',
  inputs: [
    {name: 'repeats',   type: 'float', default: 10},
  ],
  glsl: `
  vec2 c = floor(repeats * (_st - 0.5));
  float d = sign(mod(c.x + c.y, 2.0));
  return vec4(d, d, d, 1);
`})
setFunction({
  name: 'concentric',
  type: 'src',
  inputs: [
    {name: 'scale',   type: 'float', default: 100},
    {name: 'centerX', type: 'float', default: 0.5},
    {name: 'centerY', type: 'float', default: 0.5},
  ],
  glsl: `
   float d = sin(scale*distance(_st, vec2(centerX, centerY)));
   return vec4(d, d, d, 1);
`})
setFunction({
  name: 'spiral',
  type: 'src',
  inputs: [
    {name: 'a',         type: 'float', default: 1.0},
    {name: 'b',         type: 'float', default: 5.0},
    {name: 'thickness', type: 'float', default: 0.1},
  ],
  glsl: `
    vec2 center = _st - vec2(0.5);
    float thick = clamp(thickness, 0.0, 1.0);
    float phi = atan(center.y, center.x) / 6.283185307179586 + 0.5;
    float r = length(center);
    float where = mod(a* phi - b *r, 1.0);
    const float epsilon = 0.00001;
    float d = smoothstep(epsilon, epsilon, where)
            - smoothstep(thick-epsilon, thick+epsilon, where);
    return vec4(d, d, d, 1);
`})
// see: Darwyn Peachey, Building Procedural Textures, page 37
setFunction({
  name: 'brick',
  type: 'src',
  inputs: [
    {name: 'width',  type: 'float', default: 0.25},
    {name: 'height', type: 'float', default: 0.08},
    {name: 'gap',    type: 'float', default: 0.01},
  ],
  glsl: `
  vec2 p = _st-0.5;
  const float eps = 0.001;
  float BMWIDTH = width+gap;
  float BMHEIGHT = height+gap;
  float MWF = gap * 0.5 / BMWIDTH;
  float MHF = gap * 0.5 / BMHEIGHT;
  float bms = p.x / BMWIDTH;
  float bmt = p.y / BMHEIGHT;
  if(mod(bmt*0.5, 1.0) > 0.5)
    bms += 0.5;
  float sbrick = floor(bms);
  float tbrick = floor(bmt);
  bms -= sbrick;
  bmt -= tbrick;
  float w = smoothstep(MWF, MWF+eps, bms) - smoothstep(1.0-MWF-eps, 1.0-MWF, bms);
  float h = smoothstep(MHF, MHF+eps, bmt) - smoothstep(1.0-MHF-eps, 1.0-MHF, bmt);
  float d = w*h;
  return vec4(d, d, d, 1);
`})
setFunction({
  name: 'wave',
  type: 'src',
  inputs: [
    {name: 'time',    type: 'float', default: 0.0},
    {name: 'frequ',   type: 'float', default: 10.0},
    {name: 'loops',   type: 'float', default: 3.0},
    {name: 'thick',   type: 'float', default: 0.025},
  ],
  glsl: `
  const float eps = 0.001;
  float x = _st.x - time;
  float y = _st.y - 0.5;
  float scale = 0.25;
  float l = 0.0;
  for(int i=0; i<6; ++i) {
    y += scale * sin(frequ * x);
    if(l >= loops) break;
    scale *= 0.5;
    frequ *= 2.0;
    l += 1.0;
  }
  float d = smoothstep(0.0, eps, y) - smoothstep(thick, thick+eps, y);
  return vec4(d, d, d, 1);
`})
// see: https://en.wikipedia.org/wiki/Harmonograph
setFunction({
  name: 'lissa',
  type: 'src',
  inputs: [
    {name: 'time',   type: 'float', default: 0.0},
    {name: 'frequ',   type: 'float', default: 10.0},
    {name: 'loops',   type: 'float', default: 3.0},
    {name: 'thick',   type: 'float', default: 0.025},
  ],
  glsl: `
  const float eps = 0.001;
  _st -= 0.5;
  vec2 pol = vec2(
    atan(_st.y, _st.x),
    2.0*length(_st)
  );
  float x = pol.x - time;
  float y = pol.y - 0.5;
  float scale = 0.25;
  float l = 0.0;
  for(int i=0; i<6; ++i) {
    y += scale * sin(frequ * x);
    if(l >= loops) break;
    scale *= 0.5;
    frequ *= 2.0;
    l += 1.0;
  }
  float d = smoothstep(0.0, eps, y) - smoothstep(thick, thick+eps, y);
  return vec4(d, d, d, 1);
`})
