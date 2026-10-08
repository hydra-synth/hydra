// licensed with GNU AFFERO GENERAL PUBLIC LICENSE Version 3
// author: Thomas Jourdan
// see: 4x4 Bayer Dithering by kbjwes77
// see: https://www.shadertoy.com/view/WstXR8
setFunction({
  name: 'dither',
  type: 'color',
  inputs: [
  ],
  glsl: `
  float lum = 0.299 * _c0.r + 0.587 * _c0.g + 0.114 * _c0.b;
  int x = int(mod(gl_FragCoord.x, 4.0));
  int y = int(mod(gl_FragCoord.y, 4.0));
  float bayer = 0.0;
  if(x == 0) {
    if(y == 0) {
    }
    else if(y == 1) {
      bayer = 8.0/16.0;
    }
    else if(y == 2) {
      bayer = 2.0/16.0;
    }
    else if(y == 3) {
      bayer = 10.0/16.0;
    }
  }
  else if(x == 1) {
    if(y == 0) {
      bayer = 12.0/16.0;
    }
    else if(y == 1) {
      bayer = 4.0/16.0;
    }
    else if(y == 2) {
      bayer = 14.0/16.0;
    }
    else if(y == 3) {
      bayer = 6.0/16.0;
    }
  }
  else if(x == 2) {
    if(y == 0) {
      bayer = 3.0;
    }
    else if(y == 1) {
      bayer = 11.0/16.0;
    }
    else if(y == 2) {
      bayer = 1.0/16.0;
    }
    else if(y == 3) {
      bayer = 9.0/16.0;
    }
  }
  else if(x == 3) {
    if(y == 0) {
      bayer = 15.0/16.0;
    }
    else if(y == 1) {
      bayer = 7.0/16.0;
    }
    else if(y == 2) {
      bayer = 13.0/16.0;
    }
    else if(y == 3) {
      bayer = 5.0/16.0;
    }
  }
  return (lum+1.0/32.0) > bayer ? vec4(1, 1, 1, _c0.a) : vec4(0, 0, 0, _c0.a);
`})
setFunction({
  name: 'dither2',
  type: 'color',
  inputs: [
  ],
  glsl: `
  float lum = 0.299 * _c0.r + 0.587 * _c0.g + 0.114 * _c0.b;
  int x = int(mod(gl_FragCoord.x, 2.0));
  int y = int(mod(gl_FragCoord.y, 2.0));
  float bayer = 0.0;
  if(x == 0) {
    if(y == 0) {
    }
    else if(y == 1) {
      bayer = 3.0/4.0;
    }
  }
  else if(x == 1) {
    if(y == 0) {
      bayer = 2.0/4.0;
    }
    else if(y == 1) {
      bayer = 1.0/14.0;
    }
  }
  bayer += 1.0/8.0;
  return vec4(
    step(bayer, _c0.r),
    step(bayer, _c0.g),
    step(bayer, _c0.b),
    _c0.a);
`})
setFunction({
  name: 'dither4',
  type: 'color',
  inputs: [
  ],
  glsl: `
  int x = int(mod(gl_FragCoord.x, 4.0));
  int y = int(mod(gl_FragCoord.y, 4.0));
  float bayer = 1.0/32.0;
  if(x == 0) {
    if(y == 0) {
    }
    else if(y == 1) {
      bayer = 8.0/16.0+1.0/32.0;
    }
    else if(y == 2) {
      bayer = 2.0/16.0+1.0/32.0;
    }
    else if(y == 3) {
      bayer = 10.0/16.0+1.0/32.0;
    }
  }
  else if(x == 1) {
    if(y == 0) {
      bayer = 12.0+1.0/32.0;
    }
    else if(y == 1) {
      bayer = 4.0/16.0+1.0/32.0;
    }
    else if(y == 2) {
      bayer = 14.0/16.0+1.0/32.0;
    }
    else if(y == 3) {
      bayer = 6.0/16.0+1.0/32.0;
    }
  }
  else if(x == 2) {
    if(y == 0) {
      bayer = 3.0;
    }
    else if(y == 1) {
      bayer = 11.0/16.0+1.0/32.0;
    }
    else if(y == 2) {
      bayer = 1.0/16.0+1.0/32.0;
    }
    else if(y == 3) {
      bayer = 9.0/16.0+1.0/32.0;
    }
  }
  else if(x == 3) {
    if(y == 0) {
      bayer = 15.0/16.0+1.0/32.0;
    }
    else if(y == 1) {
      bayer = 7.0/16.0+1.0/32.0;
    }
    else if(y == 2) {
      bayer = 13.0/16.0+1.0/32.0;
    }
    else if(y == 3) {
      bayer = 5.0/16.0+1.0/32.0;
    }
  }
  return vec4(
    step(bayer, _c0.r),
    step(bayer, _c0.g),
    step(bayer, _c0.b),
    _c0.a);
`})
setFunction({
  name: 'ditherrnd',
  type: 'color',
  inputs: [
  ],
  glsl: `
  float lum = 0.299 * _c0.r + 0.587 * _c0.g + 0.114 * _c0.b;
  // see: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
  const highp float a = 12.9898;
  const highp float b = 78.233;
  const highp float c = 43758.5453;
  highp float dt= dot(gl_FragCoord.xy ,vec2(a ,b));
  highp float sn= mod(dt, 3.141592653589793);
  highp float tresh = fract(sin(sn) * c);
  return lum > tresh ? vec4(1, 1, 1, _c0.a) : vec4(0, 0, 0, _c0.a);
`})
setFunction({
  name: 'ditherrndcolor',
  type: 'color',
  inputs: [
  ],
  glsl: `
  float lum = 0.299 * _c0.r + 0.587 * _c0.g + 0.114 * _c0.b;
  // see: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
  const highp float a = 12.9898;
  const highp float b = 78.233;
  const highp float c = 43758.5453;
  highp float dt= dot(gl_FragCoord.xy ,vec2(a ,b));
  highp float sn= mod(dt, 3.141592653589793);
  highp float tresh = fract(sin(sn) * c);
  return vec4(
    step(tresh, _c0.r),
    step(tresh, _c0.g),
    step(tresh, _c0.b),
    _c0.a);
`})
setFunction({
  name: 'erode',
  type: 'color',
  inputs: [
  ],
  glsl: `
  vec3 outputColor = vec3(1.0);
	outputColor = min(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  1))/resolution.xy).rgb);
	outputColor = min(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2( 0,  1))/resolution.xy).rgb);
	outputColor = min(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  1))/resolution.xy).rgb);
	outputColor = min(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  0))/resolution.xy).rgb);
	outputColor = min(outputColor, texture2D(tex0, (gl_FragCoord.xy)/resolution.xy).rgb);
	outputColor = min(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  0))/resolution.xy).rgb);
	outputColor = min(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2(-1, -1))/resolution.xy).rgb);
	outputColor = min(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2( 0, -1))/resolution.xy).rgb);
	outputColor = min(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2( 1, -1))/resolution.xy).rgb);
  return vec4(outputColor, _c0.a);
`})
setFunction({
  name: 'dilate',
  type: 'color',
  inputs: [
  ],
  glsl: `
  vec3 outputColor = vec3(0.0);
	outputColor = max(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  1))/resolution.xy).rgb);
	outputColor = max(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2( 0,  1))/resolution.xy).rgb);
	outputColor = max(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  1))/resolution.xy).rgb);
	outputColor = max(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  0))/resolution.xy).rgb);
	outputColor = max(outputColor, texture2D(tex0, (gl_FragCoord.xy)/resolution.xy).rgb);
	outputColor = max(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  0))/resolution.xy).rgb);
	outputColor = max(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2(-1, -1))/resolution.xy).rgb);
	outputColor = max(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2( 0, -1))/resolution.xy).rgb);
	outputColor = max(outputColor, texture2D(tex0, (gl_FragCoord.xy + vec2( 1, -1))/resolution.xy).rgb);
  return vec4(outputColor, _c0.a);
`})
setFunction({
  name: 'blur',
  type: 'color',
  inputs: [
  ],
  glsl: `
  vec3 outputColor;
	outputColor  = 0.077847 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  1))/resolution.xy).rgb;
	outputColor += 0.123317 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0,  1))/resolution.xy).rgb;
	outputColor += 0.077847 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  1))/resolution.xy).rgb;
	outputColor += 0.123317 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  0))/resolution.xy).rgb;
	outputColor += 0.195346 * texture2D(tex0, (gl_FragCoord.xy)/resolution.xy).rgb;
	outputColor += 0.123317 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  0))/resolution.xy).rgb;
	outputColor += 0.077847 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1, -1))/resolution.xy).rgb;
	outputColor += 0.123317 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0, -1))/resolution.xy).rgb;
	outputColor += 0.077847 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1, -1))/resolution.xy).rgb;
  return vec4(outputColor, _c0.a);
`})
setFunction({
  name: 'blurmore',
  type: 'color',
  inputs: [
  ],
  glsl: `
  vec3 outputColor;
  outputColor  = 0.003765 * texture2D(tex0, (gl_FragCoord.xy + vec2(-2, -2))/resolution.xy).rgb;
  outputColor += 0.015019 * texture2D(tex0, (gl_FragCoord.xy + vec2(-2, -1))/resolution.xy).rgb;
  outputColor += 0.023792 * texture2D(tex0, (gl_FragCoord.xy + vec2(-2,  0))/resolution.xy).rgb;
  outputColor += 0.015019 * texture2D(tex0, (gl_FragCoord.xy + vec2(-2,  1))/resolution.xy).rgb;
  outputColor += 0.003765 * texture2D(tex0, (gl_FragCoord.xy + vec2(-2,  2))/resolution.xy).rgb;
  outputColor += 0.015019 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1, -2))/resolution.xy).rgb;
  outputColor += 0.059912 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1, -1))/resolution.xy).rgb;
  outputColor += 0.094907 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  0))/resolution.xy).rgb;
  outputColor += 0.059912 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  1))/resolution.xy).rgb;
  outputColor += 0.015019 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  2))/resolution.xy).rgb;
  outputColor += 0.023792 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0, -2))/resolution.xy).rgb;
  outputColor += 0.094907 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0, -1))/resolution.xy).rgb;
  outputColor += 0.150342 * texture2D(tex0, gl_FragCoord.xy/resolution.xy).rgb;
  outputColor += 0.094907 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0,  1))/resolution.xy).rgb;
  outputColor += 0.023792 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0,  2))/resolution.xy).rgb;
  outputColor += 0.015019 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1, -2))/resolution.xy).rgb;
  outputColor += 0.059912 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1, -1))/resolution.xy).rgb;
  outputColor += 0.094907 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  0))/resolution.xy).rgb;
  outputColor += 0.059912 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  1))/resolution.xy).rgb;
  outputColor += 0.015019 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  2))/resolution.xy).rgb;
  outputColor += 0.003765 * texture2D(tex0, (gl_FragCoord.xy + vec2( 2, -2))/resolution.xy).rgb;
  outputColor += 0.015019 * texture2D(tex0, (gl_FragCoord.xy + vec2( 2, -1))/resolution.xy).rgb;
  outputColor += 0.023792 * texture2D(tex0, (gl_FragCoord.xy + vec2( 2,  0))/resolution.xy).rgb;
  outputColor += 0.015019 * texture2D(tex0, (gl_FragCoord.xy + vec2( 2,  1))/resolution.xy).rgb;
  outputColor += 0.003765 * texture2D(tex0, (gl_FragCoord.xy + vec2( 2,  2))/resolution.xy).rgb;
  return vec4(outputColor, _c0.a);
`})
setFunction({
  name: 'edge',
  type: 'color',
  inputs: [
  ],
  glsl: `
  vec3 outputColor;
	outputColor  = -1.0/8.0 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  1))/resolution.xy).rgb;
	outputColor += -1.0/8.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0,  1))/resolution.xy).rgb;
	outputColor += -1.0/8.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  1))/resolution.xy).rgb;
	outputColor += -1.0/8.0 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  0))/resolution.xy).rgb;
	outputColor += 1.0 *      texture2D(tex0, (gl_FragCoord.xy)/resolution.xy).rgb;
	outputColor += -1.0/8.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  0))/resolution.xy).rgb;
	outputColor += -1.0/8.0 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1, -1))/resolution.xy).rgb;
	outputColor += -1.0/8.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0, -1))/resolution.xy).rgb;
	outputColor += -1.0/8.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1, -1))/resolution.xy).rgb;
  return vec4(outputColor, _c0.a);
`})
setFunction({
  name: 'sobelx',
  type: 'color',
  inputs: [
  ],
  glsl: `
  vec3 outputColor;
	outputColor  = -1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  1))/resolution.xy).rgb;
	outputColor += -2.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0,  1))/resolution.xy).rgb;
	outputColor += -1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  1))/resolution.xy).rgb;
	outputColor +=  1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1, -1))/resolution.xy).rgb;
	outputColor +=  2.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0, -1))/resolution.xy).rgb;
	outputColor +=  1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1, -1))/resolution.xy).rgb;
  return vec4(outputColor, _c0.a);
`})
setFunction({
  name: 'sobely',
  type: 'color',
  inputs: [
  ],
  glsl: `
  vec3 outputColor;
  outputColor  = -1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  1))/resolution.xy).rgb;
	outputColor +=  0.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0,  1))/resolution.xy).rgb;
	outputColor +=  1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  1))/resolution.xy).rgb;
	outputColor += -2.0 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  0))/resolution.xy).rgb;
	outputColor += 0.0 *      texture2D(tex0, (gl_FragCoord.xy)/resolution.xy).rgb;
	outputColor +=  2.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  0))/resolution.xy).rgb;
	outputColor += -1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1, -1))/resolution.xy).rgb;
	outputColor +=  0.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0, -1))/resolution.xy).rgb;
	outputColor +=  1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1, -1))/resolution.xy).rgb;
  return vec4(outputColor, _c0.a);
`})
setFunction({
  name: 'sharpen',
  type: 'color',
  inputs: [
  ],
  glsl: `
  vec3 outputColor;
	outputColor  = -1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0,  1))/resolution.xy).rgb;
	outputColor += -1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  0))/resolution.xy).rgb;
	outputColor += 5.0 *      texture2D(tex0, (gl_FragCoord.xy)/resolution.xy).rgb;
	outputColor += -1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  0))/resolution.xy).rgb;
	outputColor += -1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0, -1))/resolution.xy).rgb;
  return vec4(outputColor, _c0.a);
`})
setFunction({
  name: 'emboss',
  type: 'color',
  inputs: [
  ],
  glsl: `
  vec3 outputColor;
	outputColor  = -2.0 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  1))/resolution.xy).rgb;
	outputColor += -1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0,  1))/resolution.xy).rgb;
	outputColor += -1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2(-1,  0))/resolution.xy).rgb;
	outputColor +=  1.0 * texture2D(tex0, (gl_FragCoord.xy)/resolution.xy).rgb;
	outputColor +=  1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1,  0))/resolution.xy).rgb;
	outputColor +=  1.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 0, -1))/resolution.xy).rgb;
	outputColor +=  2.0 * texture2D(tex0, (gl_FragCoord.xy + vec2( 1, -1))/resolution.xy).rgb;
  return vec4(outputColor, _c0.a);
`})
setFunction({
  name: 'altline',
  type: 'color',
  inputs: [
    {name: 'width', type: 'float', default: 1.0},
  ],
  glsl: `
  if(int(mod(gl_FragCoord.y/max(width,1.0), 2.0)) == 0)
    return texture2D(tex0, gl_FragCoord.xy/resolution.xy);
  vec2 p = vec2(resolution.x - gl_FragCoord.x, gl_FragCoord.y);
  return texture2D(tex0, p/resolution.xy);
`})
// From https://ciphrd.com/2020/04/08/pixel-sorting-on-shader-using-well-crafted-sorting-filters-glsl/
// original author: ciphrd
setFunction({
  name: 'pxsort',
  type: 'color',
  inputs: [
    {name: 'threshold', type: 'float', default: 0.2},
    {name: 'frame', type: 'int', default: 0},
    {name: 'dirX', type: 'float', default: 1},
    {name: 'dirY', type: 'float', default: 0},
  ],
  glsl: `
  vec2 uv2 = gl_FragCoord.xy/resolution.xy;
  float fParity = mod(float(frame), 2.) * 2. - 1.;
  float vp = mod(floor(uv2.x * resolution.x), 2.0) * 2. - 1.;
  vec2 dir = vec2(dirX, dirY);
  dir *= fParity * vp;
  dir /= resolution.xy;
  vec4 curr = texture2D(tex0, uv2);
  vec4 comp = texture2D(tex0, uv2 + dir);
  float gCurr = (curr.r+curr.g+curr.b)/3.; // gscale(curr.rgb);
  float gComp = (comp.r+comp.g+comp.b)/3.; // gscale(comp.rgb);
  if (uv2.x + dir.x < 0.0 || uv2.x + dir.x > 1.0) {
    return curr;
  }
  if (dir.x < 0.0) {
    if (gCurr > threshold && gComp > gCurr) {
      return comp;
    } else {
      return curr;
    }
  }
  else {
    if (gComp > threshold && gCurr >= gComp) {
      return comp;
    } else {
      return curr;
    }
  }
`})
// From https://ciphrd.com/2020/04/08/pixel-sorting-on-shader-using-well-crafted-sorting-filters-glsl/
// original author: ciphrd
setFunction({
  name: 'pysort',
  type: 'color',
  inputs: [
    {name: 'threshold', type: 'float', default: 0.2},
    {name: 'frame', type: 'int', default: 0},
    {name: 'dirX', type: 'float', default: 0},
    {name: 'dirY', type: 'float', default: 1},
  ],
  glsl: `
  vec2 uv2 = gl_FragCoord.xy/resolution.xy;
  float fParity = mod(float(frame), 2.) * 2. - 1.;
  float vp = mod(floor(uv2.y * resolution.y), 2.0) * 2. - 1.;
  vec2 dir = vec2(dirX, dirY);
  dir *= fParity * vp;
  dir /= resolution.xy;
  vec4 curr = texture2D(tex0, uv2);
  vec4 comp = texture2D(tex0, uv2 + dir);
  float gCurr = (curr.r+curr.g+curr.b)/3.; // gscale(curr.rgb);
  float gComp = (comp.r+comp.g+comp.b)/3.; // gscale(comp.rgb);
  if (uv2.y + dir.y < 0.0 || uv2.y + dir.y > 1.0) {
    return curr;
  }
  if (dir.y < 0.0) {
    if (gCurr > threshold && gComp > gCurr) {
      return comp;
    } else {
      return curr;
    }
  }
  else {
    if (gComp > threshold && gCurr >= gComp) {
      return comp;
    } else {
      return curr;
    }
  }
`})
