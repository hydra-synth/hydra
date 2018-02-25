module.exports = {
  osc: {
    type: "src",
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
    glsl: `vec4 osc(vec2 st, float freq, float sync, float offset){
            float r = sin((st.x-offset/100.+time*sync)*freq)*0.5 + 0.5;
            float g = sin((st.x+time*sync)*freq)*0.5 + 0.5;
            float b = sin((st.x+offset/100.+time*sync)*freq)*0.5 + 0.5;
            return vec4(r, g, b, 1.0);
          }`
  },
  tex: {
    type: "src",
    inputs:[
      {
        name: 'tex',
        type: 'texture'
      }
    ],
    glsl: `vec4 tex(vec2 _st, sampler2D _tex){
      return texture2D(_tex, _st);
    }`
  },
  rotate: {
    type: "coord",
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

  add: {
    type: "combine",
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
            return amount*c0 + (1.0-amount)*c1;
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
    type: "combineCoord",
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
            return st+c1.xy*amount;
          }`
  },
  invert: {
    type: 'color',
    inputs: [],
    glsl: `vec4 invert(vec4 c0){
      return vec4(1.0-c0.rgb, c0.a);
    }`
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
  }
}
