// licensed with GNU AFFERO GENERAL PUBLIC LICENSE Version 3
// author: Thomas Jourdan
// see: https://medium.com/@rupertontheloose/functional-shaders-a-colorful-intro-part5-tinting-with-sepia-tone-cd6c2b49806
setFunction({
  name: 'sepia',
  type: 'color',
  inputs: [
    {name: 'amount',    type: 'float', default: 1.0},
  ],
  glsl: `
  const mat3 sepiaMat = mat3(
    0.393, 0.769, 0.189,
    0.349, 0.686, 0.168,
    0.272, 0.534, 0.131);
  vec3 se = _c0.rgb * sepiaMat;
  return vec4(amount * se + (1.0 - amount) * _c0.rgb, _c0.a);
`})
setFunction({
  name: 'levels',
  type: 'color',
  inputs: [
    {name: 'levels',    type: 'float', default: 3.0},
    {name: 'amount',    type: 'float', default: 1.0},
  ],
  glsl: `
  vec3 le = floor(_c0.rgb * levels) / levels;
  return vec4(amount * le + (1.0 - amount) * _c0.rgb, _c0.a);
`})
// see: https://rosenzweig.io/blog/monotone-portraits-with-glsl.html
// The original source code by Alyssa Rosenzweig is available under the MIT license.
// https://gitlab.freedesktop.org/alyssa/monotone-portraits/blob/master/posterize.html
// The box blur filter is not ported from original source code to Hydra.
setFunction({
  name: 'monotone',
  type: 'color',
  inputs: [
    {name: 'levels', type: 'float', default: 3.0},
    {name: 'hue',    type: 'float', default: 0.6},
    {name: 'amount', type: 'float', default: 1.0},
  ],
  glsl: `
	float grey = dot(_c0.rgb, vec3(0.2126, 0.7152, 0.0722));
	grey = clamp(grey * 1.1, 0.0, 1.0);
	float poster = floor(grey * levels + 0.5) / levels;
	float contrast = clamp(1.4 * (poster - 0.5) + 0.5, 0.0, 1.0);
	vec3 rgb = _hsvToRgb(vec3(hue, 0.4, contrast));
  return vec4(amount * rgb + (1.0 - amount) * _c0.rgb, _c0.a);
`})
// see: https://github.com/kbinani/colormap-shaders/blob/master/shaders/glsl/transform_rose.frag
// by kbinani MIT License
setFunction({
  name: 'grarose',
  type: 'color',
  inputs: [
    {name: 'amount',    type: 'float', default: 1.0},
  ],
  glsl: `
  const float d3 = 1.0 / 3.0;
  float gray = d3 * (_c0.r + _c0.g + _c0.b);
  vec3 co = vec3(1.0);
  if (gray < 0.0) {
      co.r = 54.0 / 255.0;
  } else if (gray < 20049.0 / 82979.0) {
      co.r = (829.79 * gray + 54.51) / 255.0;
  }
  if (gray < 20049.0 / 82979.0) {
      co.g = 0.0;
  } else if (gray < 327013.0 / 810990.0) {
      co.g = (8546482679670.0 / 10875673217.0 * gray - 2064961390770.0 / 10875673217.0) / 255.0;
  } else if (gray <= 1.0) {
      co.g = (103806720.0 / 483977.0 * gray + 19607415.0 / 483977.0) / 255.0;
  }
  if (gray < 0.0) {
      co.b = 54.0 / 255.0;
  } else if (gray < 7249.0 / 82979.0) {
      co.b = (829.79 * gray + 54.51) / 255.0;
  } else if (gray < 20049.0 / 82979.0) {
      co.b = 127.0 / 255.0;
  } else if (gray < 327013.0 / 810990.0) {
      co.b = (792.02249341361393720147485376583 * gray - 64.364790735602331034989206222672) / 255.0;
  }
  return vec4(amount * clamp(co, 0.0, 1.0) + (1.0 - amount) * _c0.rgb, _c0.a);
`})
// see: https://github.com/kbinani/colormap-shaders/blob/master/shaders/glsl/transform_rose.frag
// by kbinani MIT License
setFunction({
  name: 'grawave',
  type: 'color',
  inputs: [
    {name: 'amount',    type: 'float', default: 1.0},
  ],
  glsl: `
  const float d3 = 1.0 / 3.0;
  float gray = d3 * (_c0.r + _c0.g + _c0.b);
  vec3 co;
  if (gray < 0.0) {
      co.r = 124.0 / 255.0;
  } else if (gray <= 1.0) {
      co.r = (128.0 * sin(6.25 * (gray + 0.5)) + 128.0) / 255.0;
  } else {
      co.r = 134.0 / 255.0;
  }
  if (gray < 0.0) {
      co.g = 121.0 / 255.0;
  } else if (gray <= 1.0) {
      co.g = (63.0 * sin(gray * 99.72) + 97.0) / 255.0;
  } else {
      co.g = 52.0 / 255.0;
  }
  if (gray < 0.0) {
      co.b = 131.0 / 255.0;
  } else if (gray <= 1.0) {
      co.b = (128.0 * sin(6.23 * gray) + 128.0) / 255.0;
  } else {
      co.b = 121.0 / 255.0;
  }
  return vec4(amount * clamp(co, 0.0, 1.0) + (1.0 - amount) * _c0.rgb, _c0.a);
`})
// see: https://github.com/kbinani/colormap-shaders/blob/master/shaders/glsl/IDL_CB-YIGnBu.frag
// by kbinani MIT License
setFunction({
  name: 'graua',
  type: 'color',
  inputs: [
    {name: 'amount',    type: 'float', default: 1.0},
  ],
  glsl: `
  vec3 co = vec3(0.0);
  const float d3 = 1.0 / 3.0;
  float gray = d3 * (_c0.r + _c0.g + _c0.b);
  if (gray < 0.2523055374622345) {
      co.r = (-5.80630393656902E+02 * gray - 8.20261301968494E+01) * gray + 2.53829637096771E+02;
  } else if (gray < 0.6267540156841278) {
      co.r = (((-4.07958939010649E+03 * gray + 8.13296992114899E+03) * gray - 5.30725139102868E+03) * gray + 8.58474724851723E+02) * gray + 2.03329669375107E+02;
  } else if (gray < 0.8763731146612115) {
      co.r = 3.28717357910916E+01 * gray + 8.82117255504255E+00;
  } else {
      co.r = -2.29186583577707E+02 * gray + 2.38482038123159E+02;
  }
  if (gray < 0.4578040540218353) {
      co.g = ((4.49001704856054E+02 * gray - 5.56217473429394E+02) * gray + 2.09812296466262E+01) * gray + 2.52987561849833E+02;
  } else {
      co.g = ((1.28031059709139E+03 * gray - 2.71007279113343E+03) * gray + 1.52699334501816E+03) * gray - 6.48190622715140E+01;
  }
  if (gray < 0.1239372193813324) {
      co.b = (1.10092779856059E+02 * gray - 3.41564374557536E+02) * gray + 2.17553885630496E+02;
  } else if (gray < 0.7535201013088226) {
      co.b = ((((3.86204601547122E+03 * gray - 8.79126469446648E+03) * gray + 6.80922226393264E+03) * gray - 2.24007302003438E+03) * gray + 3.51344388740066E+02) * gray + 1.56774650431396E+02;
  } else {
      co.b = (((((-7.46693234167480E+06 * gray + 3.93327773566702E+07) * gray - 8.61050867447971E+07) * gray + 1.00269040461745E+08) * gray - 6.55080846112976E+07) * gray + 2.27664953009389E+07) * gray - 3.28811994253461E+06;
  }
  return vec4(amount * clamp(co, 0.0, 1.0) + (1.0 - amount) * _c0.rgb, _c0.a);
`})
setFunction({
  name: 'colcross',
  type: 'combine',
  inputs: [
    {name: 'amount',    type: 'float', default: 1.0},
  ],
  glsl: `
vec3 cc = cross(_c0.rgb, _c1.rgb);
return vec4(amount * cc + (1.0 - amount) * _c0.rgb, _c0.a);
`})
setFunction({
  name: 'coldot',
  type: 'combine',
  inputs: [
    {name: 'amount',    type: 'float', default: 1.0},
  ],
  glsl: `
vec3 cc = vec3(dot(_c0.rgb, _c1.rgb),
               dot(_c0.rgb, _c1.brg),
               dot(_c0.rgb, _c1.gbr));
return vec4(amount * cc + (1.0 - amount) * _c0.rgb, _c0.a);
`})
setFunction({
  name: 'colboost',
  type: 'combine',
  inputs: [
    {name: 'amount',    type: 'float', default: 1.0},
  ],
  glsl: `
vec3 cc = cross(_c0.rgb, _c1.rgb);
cc = normalize(_c0.rgb);
return vec4(amount * cc + (1.0 - amount) * _c0.rgb, _c0.a);
`})
setFunction({
  name: 'colreflect',
  type: 'combine',
  inputs: [
    {
      type: 'float',
      name: 'amount',
      default: 1,
    }
  ],
  glsl: `
vec3 cc = cross(_c0.rgb, normalize(_c1.rgb));
return vec4(amount * cc + (1.0 - amount) * _c0.rgb, _c0.a);
`})
setFunction({
  name: 'hsvshift',
  type: 'color',
  inputs: [
    {name: 'hue',        type: 'float', default: 0.0},
    {name: 'saturation', type: 'float', default: 1.0},
    {name: 'value',      type: 'float', default: 1.0},
  ],
  glsl: `
  vec3 hsv = _rgbToHsv(_c0.rgb);
  hsv.x += hue;
  hsv.y *= saturation;
  hsv.z *= value;
  return vec4(_hsvToRgb(hsv), _c0.a);
`})
