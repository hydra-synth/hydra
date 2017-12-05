module.exports = {
  src: {
    transformType: 'color',
    isSource: true,
    inputs: [{
      name: 'src',
      type: 'image'
    }],
    fragBody: `
      c = texture2D(<0>, st);
    `
  },
  invert: {
    transformType: 'color',
    fragBody: `
      c = 1.0-c;
      c = vec4(c.xyz, 1.0);
    `
  },
  osc: {
    transformType: 'color',
    isSource: true,
    inputs: [
      {
        name: 'frequency',
        type: 'float',
        default: 60
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
    fragBody: `
      float r<0> = sin((st.x-<2>/100.+time*<1>)*<0>)*0.5 + 0.5;
      float g<0> = sin((st.x+time*<1>)*<0>)*0.5 + 0.5;
		  float b<0> = sin((st.x+<2>/100.+time*<1>)*<0>)*0.5 + 0.5;
      c = vec4(r<0>, g<0>, b<0>, 1.0);
    `
  },
  blend: {
    transformType: 'color',
    inputs: [
      {
        name: 'src',
        type: 'image'
      },
      {
        name: 'blendAmount',
        type: 'float',
        default: 0.4
      }
    ],
    fragBody: `
      c*=(1.0-<1>);
      c+= texture2D(<0>, uv)*<1>;
    `
  },
  mult: {
    transformType: 'color',
    inputs: [
      {
        name: 'src',
        type: 'image'
      },
      {
        name: 'amount',
        type: 'float',
        default: 1.0
      }
    ],
    fragBody: `
      vec4 c<1> = c*(texture2D(<0>, uv));
      c*=(1.0-<1>);
      c+= c<1>*<1>;
    `
  },
  add: {
    transformType: 'color',
    inputs: [
      {
        name: 'src',
        type: 'image'
      }
    ],
    fragBody: `
      c += texture2D(<0>, uv);
    `
  },
  diff: {
    transformType: 'color',
    inputs: [
      {
        name: 'src',
        type: 'image'
      }
    ],
    fragBody: `
      c -= texture2D(<0>, uv);
      c = vec4(abs(c).xyz, 1.0);
    `
  },
  scale: {
    transformType: 'coord',
    inputs: [
      {
        name: 'scaleAmount',
        type: 'float',
        default: 1.5
      }
    ],
    fragBody: `
      st = vec2(1.0/<0>)*st;
    `
  },
  pixelate: {
    transformType: 'coord',
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
    fragBody: `
      st *= vec2(<0>, <1>);
      st = floor(st) + 0.5;
      st /= vec2(<0>, <1>);
    `
  },
  contrast: {
    transformType: 'color',
    inputs: [
      {
        name: 'contrast',
        type: 'float',
        default: 1.6
      }
    ],
    fragBody: `
      c = (c-vec4(0.5))*<0> + vec4(0.5);
      c = vec4(c.xyz, 1.0);
    `
  },
  kaleid: {
    transformType: 'coord',
    inputs: [
      {
        name: 'nSides',
        type: 'float',
        default: 4.0
      }
    ],
    fragBody: `
      st -= 0.5;
      float r<0> = length(st);
      float a<0> = atan(st.y, st.x);
      float pi<0> = 2.*3.1416;
      a<0> = mod(a<0>, pi<0>/<0>);
      a<0> = abs(a<0>-pi<0>/<0>/2.);
      st = r<0>*vec2(cos(a<0>), sin(a<0>));
    `
  },
  brightness: {
    transformType: 'color',
    inputs: [
      {
        name: 'brightness',
        type: 'float',
        default: 0.4
      }
    ],
    fragBody: `
      c = vec4(c.xyz + vec3(<0>), 1.0);
    `
  },
  posterize: {
    transformType: 'color',
    inputs: [
      {
        name: 'bins',
        type: 'float',
        default: 3.0
      },
      {
        name: 'gamma',
        type: 'float',
        default: 0.6
      }
    ],
    fragBody: `
      c = pow(c, vec4(<1>));
      c*=vec4(<0>);
      c = floor(c);
      c/=vec4(<0>);
      c = pow(c, vec4(1.0/<1>));
      c = vec4(c.xyz, 1.0);
    `
  },
  modulate: {
    transformType: 'coord',
    inputs: [
      {
        name: 'src',
        type: 'image'
      },
      {
        name: 'amount',
        type: 'float',
        default: 0.1
      }
    ],
    fragBody: `
      st += texture2D(<0>, uv).xy*<1>;
    `
  },

  color: {
    transformType: 'color',
    inputs: [{
      name: 'color',
      type: 'color',
      default: [1.0, 0.5, 0.0]
    }],
    fragBody: `
      c.rgb = c.rgb*<0>;
      c = vec4(c.rgb, 1.0);
    `
  },
gradient: {
  transformType: 'color',
  isSource: true,
  fragBody: `
    c = vec4(st, sin(time), 1.0);
  `
},
scrollX: {
  transformType: 'coord',
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
  fragBody:  `
    st.x += <0> + time*<1>;
    st = fract(st);
  `
},
repeatX: {
  transformType: 'coord',
  inputs: [
    {
      name: 'repeatX',
      type: 'float',
      default: 3.0
    },{
      name: 'offsetX',
      type: 'float',
      default: 0.0
    }
  ],
  fragBody: `
    st*= vec2(<0>, 1.0);
    st.x += step(1., mod(st.y,2.0)) * <1>;
    st = fract(st);
    `
},
repeatY: {
  transformType: 'coord',
  inputs: [
    {
      name: 'repeatY',
      type: 'float',
      default: 3.0
    },{
      name: 'offsetY',
      type: 'float',
      default: 0.0
    }
  ],
  fragBody: `
    st*= vec2(1.0, <0>);
    st.y += step(1., mod(st.x,2.0)) * <1>;
    st = fract(st);
    `
},
repeat: {
  transformType: 'coord',
  inputs: [
    {
      name: 'repeatX',
      type: 'float',
      default: 3.0
    },
    {
      name: 'repeatY',
      type: 'float',
      default: 3.0
    },
    {
      name: 'offsetX',
      type: 'float',
      default: 0.0
    },
    {
      name: 'offsetY',
      type: 'float',
      default: 0.0
    }
  ],
  fragBody: `
    st*= vec2(<0>, <1>);
    st.x += step(1., mod(st.y,2.0)) * <2>;
    st.y += step(1., mod(st.x,2.0)) * <3>;
    st = fract(st);
    `
},
rotate: {
  transformType: 'coord',
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
  fragBody: `
    st -= vec2(0.5);
    float angle<0> = <0> + <1>*time;
    st = mat2(cos(angle<0>),-sin(angle<0>), sin(angle<0>),cos(angle<0>))*st;
    st += vec2(0.5);
  `
}
}
