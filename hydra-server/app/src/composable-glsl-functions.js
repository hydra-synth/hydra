module.exports = {
  random: {
    type: 'util',
    glsl: `float random (vec2 _st){
      return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))*43758.5453123);
    }`
  },
  _noise: {
    type: 'util',
    glsl: `float _noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
          }`
  },
  noise: {
    type: 'src',
    inputs: [
      {
        type: 'float',
        name: 'scale',
        default: 100
      }
    ],
    glsl: `vec4 noise(vec2 st, float scale){
      return vec4(vec3(_noise(st*scale)), 1.0);
    }`
  },

  osc: {
    type: 'src',
    inputs: [
      {
        name: 'frequency',
        type: 'float',
        default: 60.0
      },
      {
        name: 'sync',
        type: 'float',
        default: 0.1
      },
      {
        name: 'offset',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec4 osc(vec2 _st, float freq, float sync, float offset){
            vec2 st = _st - vec2(0.5);
            float r = sin((st.x-offset/freq+time*sync)*freq)*0.5  + 0.5;
            float g = sin((st.x+time*sync)*freq)*0.5 + 0.5;
            float b = sin((st.x+offset/freq+time*sync)*freq)*0.5  + 0.5;
            return vec4(r, g, b, 1.0);
          }`
  },
  src: {
    type: 'src',
    inputs: [
      {
        name: 'tex',
        type: 'texture'
      }
    ],
    glsl: `vec4 src(vec2 _st, sampler2D _tex){
    //  vec2 uv = gl_FragCoord.xy/vec2(1280., 720.);
      return texture2D(_tex,_st);
    }`
  },
  rotate: {
    type: 'coord',
    inputs: [
      {
        name: 'angle',
        type: 'float',
        default: 10.0
      }, {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 rotate(vec2 st, float _angle, float speed){
              vec2 xy = st - vec2(0.5);
              float angle = _angle + speed *time;
              xy = mat2(cos(angle),-sin(angle), sin(angle),cos(angle))*xy;
              xy += 0.5;
              return xy;
          }`
  },
  scale: {
    type: 'coord',
    inputs: [
      {
        name: 'amount',
        type: 'float',
        default: 1.5
      }
    ],
    glsl: `vec2 scale(vec2 st, float amount){
      vec2 xy = st - vec2(0.5);
      xy*=(1.0/amount);
      xy+=vec2(0.5);
      return xy;
    }
    `
  },
  pixelate: {
    type: 'coord',
    inputs: [
      {
        name: 'pixelX',
        type: 'float',
        default: 20
      }, {
        name: 'pixelY',
        type: 'float',
        default: 20
      }
    ],
    glsl: `vec2 pixelate(vec2 st, float pixelX, float pixelY){
      vec2 xy = vec2(pixelX, pixelY);
      return (floor(st * xy) + 0.5)/xy;
    }`
  },
  kaleid: {
    type: 'coord',
    inputs: [
      {
        name: 'nSides',
        type: 'float',
        default: 4.0
      }
    ],
    glsl: `vec2 kaleid(vec2 st, float nSides){
      st -= 0.5;
      float r = length(st);
      float a = atan(st.y, st.x);
      float pi = 2.*3.1416;
      a = mod(a,pi/nSides);
      a = abs(a-pi/nSides/2.);
      return r*vec2(cos(a), sin(a));
    }`
  },
  scrollX: {
    type: 'coord',
    inputs: [
      {
        name: 'scrollX',
        type: 'float',
        default: 0.5
      },
      {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 scrollX(vec2 st, float amount, float speed){
      st.x += amount + time*speed;
      return fract(st);
    }`
  },
  scrollY: {
    type: 'coord',
    inputs: [
      {
        name: 'scrollY',
        type: 'float',
        default: 0.5
      },
      {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 scrollY(vec2 st, float amount, float speed){
      st.y += amount + time*speed;
      return fract(st);
    }`
  },
  add: {
    type: 'combine',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'amount',
        type: 'float',
        default: 0.5
      }
    ],
    glsl: `vec4 add(vec4 c0, vec4 c1, float amount){
            return (c0+c1)*amount + c0*(1.0-amount);
          }`
  },
  layer: {
    type: 'combine',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      }
    ],
    glsl: `vec4 layer(vec4 c0, vec4 c1){
        return vec4(mix(c0.rgb, c1.rgb, c1.a), c0.a+c1.a);
    }
    `
  },
  blend: {
    type: 'combine',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'amount',
        type: 'float',
        default: 0.5
      }
    ],
    glsl: `vec4 blend(vec4 c0, vec4 c1, float amount){
      return c0*(1.0-amount)+c1*amount;
    }`
  },
  mult: {
    type: 'combine',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'amount',
        type: 'float',
        default: 1.0
      }
    ],
    glsl: `vec4 mult(vec4 c0, vec4 c1, float amount){
      return c0*(1.0-amount)+(c0*c1)*amount;
    }`
  },
  diff: {
    type: 'combine',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      }
    ],
    glsl: `vec4 diff(vec4 c0, vec4 c1){
      return vec4(abs(c0.rgb-c1.rgb), max(c0.a, c1.a));
    }
    `
  },

  modulate: {
    type: 'combineCoord',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'amount',
        type: 'float',
        default: 0.5
      }
    ],
    glsl: `vec2 modulate(vec2 st, vec4 c1, float amount){
            return fract(st+(c1.xy-0.5)*amount);
          }`
  },

  modulateHue: {
    type: 'combineCoord',
    notes: 'changes coordinates based on hue of second input. Based on: https://www.shadertoy.com/view/XtcSWM',
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'amount',
        type: 'float',
        default: 1.0
      }
    ],
    glsl: `vec2 modulateHue(vec2 st, vec4 c1, float amount){

            return st + (vec2(c1.g - c1.r, c1.b - c1.g) * amount * 1.0/resolution);
          }`
  },
  invert: {
    type: 'color',
    inputs: [],
    glsl: `vec4 invert(vec4 c0){
      return vec4(1.0-c0.rgb, c0.a);
    }`
  },
  contrast: {
    type: 'color',
    inputs: [
      {
        name: 'amount',
        type: 'float',
        default: 1.6
      }
    ],
    glsl: `vec4 contrast(vec4 c0, float amount) {
      vec4 c = (c0-vec4(0.5))*vec4(amount) + vec4(0.5);
      return vec4(c.rgb, 1.0);
    }
    `
  },
  luminance: {
    type: 'util',
    glsl: `float luminance(vec3 rgb){
      const vec3 W = vec3(0.2125, 0.7154, 0.0721);
      return dot(rgb, W);
    }`
  },
  luma: {
    type: 'color',
    inputs: [
      {
        name: 'threshold',
        type: 'float',
        default: 0.5
      },
      {
        name: 'tolerance',
        type: 'float',
        default: 0.1
      }
    ],
    glsl: `vec4 luma(vec4 c0, float threshold, float tolerance){
      float a = smoothstep(threshold-tolerance, threshold+tolerance, luminance(c0.rgb));
      return vec4(c0.rgb*a, a);
    }`
  },
  thresh: {
    type: 'color',
    inputs: [
      {
        name: 'threshold',
        type: 'float',
        default: 0.5
      }, {
        name: 'tolerance',
        type: 'float',
        default: 0.04
      }
    ],
    glsl: `vec4 thresh(vec4 c0, float threshold, float tolerance){
      return vec4(vec3(smoothstep(threshold-tolerance, threshold+tolerance, luminance(c0.rgb))), c0.a);
    }`
  },
  color: {
    type: 'color',
    inputs: [
      {
        name: 'r',
        type: 'float',
        default: 1.0
      },
      {
        name: 'g',
        type: 'float',
        default: 1.0
      },
      {
        name: 'b',
        type: 'float',
        default: 1.0
      }
    ],
    notes: 'https://www.youtube.com/watch?v=FpOEtm9aX0M',
    glsl: `vec4 color(vec4 c0, float _r, float _g, float _b){
      vec3 c = vec3(_r, _g, _b);
      vec3 pos = step(0.0, c); // detect whether negative

      // if > 0, return r * c0
      // if < 0 return (1.0-r) * c0
      return vec4(mix((1.0-c0.rgb)*abs(c), c*c0.rgb, pos), c0.a);
    }`
  },
  rgbToHsv: {
    type: 'util',
    glsl: `vec3 rgbToHsv(vec3 c){
            vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
            vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
            vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

            float d = q.x - min(q.w, q.y);
            float e = 1.0e-10;
            return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }`
  },
  hsvToRgb: {
    type: 'util',
    glsl: `vec3 hsvToRgb(vec3 c){
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }`
  },
  colorama: {
    type: 'color',
    inputs: [
      {
        name: 'amount',
        type: 'float',
        default: 0.005
      }
    ],
    glsl: `vec4 colorama(vec4 c0, float amount){
      vec3 c = rgbToHsv(c0.rgb);
      c += vec3(amount);
      c = hsvToRgb(c);
      c = fract(c);
      return vec4(c, c0.a);
    }`
  }
}
