const Output = require('./output.js')
const loop = require('raf-loop')
const Source = require('./source.js')
const Generator = require('./Generator.js')
const mouse = require('mouse-change')()

// to do: add ability to pass in certain uniforms and transforms

var hydraSynth = function ({
  pb = null,
  width = 1280,
  height = 720,
  numSources = 4,
  numOutputs = 4,
  makeGlobal = true,
  canvas
}) {
  Generator() // make global
  this.pb = pb
  this.width = width
  this.height = height
  this.time = 0

  // create main output canvas and add to screen
  if (canvas) {
    this.canvas = canvas
  } else {
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    document.body.appendChild(this.canvas)
  }
  this.regl = require('regl')({
    canvas: this.canvas,
    pixelRatio: 1,
    extensions: [
      'oes_texture_half_float',
      'oes_texture_half_float_linear'
    ],
    optionalExtensions: [
      'oes_texture_float',
      'oes_texture_float_linear'
    ]})

  // This clears the color buffer to black and the depth buffer to 1
  this.regl.clear({
    color: [0, 0, 0, 1]
  })

  this.o = (Array(numOutputs)).fill().map((el, index) => {
    var o = new Output({regl: this.regl, width: width, height: height})
    o.render()
    o.id = index
    if (makeGlobal) window['o' + index] = o
    return o
  })

  this.output = this.o[0]

  this.s = (Array(numOutputs)).fill().map((el, index) => {
    var s = new Source({regl: this.regl, pb: this.pb})
    if (makeGlobal) window['s' + index] = s
    return s
  })

  this.renderAll = false
  var self = this
  // receives which output to render. if no arguments, renders grid of all fbos
  this.render = function (output) {
    if (output) {
      self.output = output
      self.renderAll = false
    } else {
      self.renderAll = true
    }
  }

  if (makeGlobal) window.render = this.render

  var renderFbo = this.regl({
    frag: `
    precision mediump float;
    varying vec2 uv;
    uniform vec2 resolution;
    uniform sampler2D tex0;

    void main () {
      gl_FragColor = texture2D(tex0, vec2(1.0 - uv.x, uv.y));
    }
    `,
    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;

    void main () {
      uv = position;
      gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
    }`,
    attributes: {
      position: [
        [-2, 0],
        [0, -2],
        [2, 2]
      ]
    },
    uniforms: {
      tex0: this.regl.prop('tex0'),
      resolution: this.regl.prop('resolution')
    },
    count: 3,
    depth: { enable: false }
  })

  // to do: dynamically set fbos in render all based on NUM_OUTPUTS
  var renderAll = this.regl({
    frag: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex0;
    uniform sampler2D tex1;
    uniform sampler2D tex2;
    uniform sampler2D tex3;

    void main () {
      vec2 st = vec2(1.0 - uv.x, uv.y);
      st*= vec2(2);
      vec2 q = floor(st).xy*(vec2(2.0, 1.0));
      int quad = int(q.x) + int(q.y);
      st.x += step(1., mod(st.y,2.0));
      st.y += step(1., mod(st.x,2.0));
      st = fract(st);
      if(quad==0){
        gl_FragColor = texture2D(tex0, st);
      } else if(quad==1){
        gl_FragColor = texture2D(tex1, st);
      } else if (quad==2){
        gl_FragColor = texture2D(tex2, st);
      } else {
        gl_FragColor = texture2D(tex3, st);
      }

    }
    `,
    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;

    void main () {
      uv = position;
      gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
    }`,
    attributes: {
      position: [
        [-2, 0],
        [0, -2],
        [2, 2]
      ]
    },
    uniforms: {
      tex0: this.regl.prop('tex0'),
      tex1: this.regl.prop('tex1'),
      tex2: this.regl.prop('tex2'),
      tex3: this.regl.prop('tex3')
    },
    count: 3,
    depth: { enable: false }
  })
  //  window.s0 = this.s[0]
  loop(function (dt) {
  // this.regl.frame(function () {
    self.time += dt * 0.001
    // console.log(self.time)
    self.regl.clear({
      color: [0, 0, 0, 1]
    })
    for (let i = 0; i < self.s.length; i++) {
      self.s[i].tick(self.time)
    }

    for (let i = 0; i < self.o.length; i++) {
      self.o[i].tick({
        time: self.time,
        mouse: mouse,
        //  bpm: self.audio.bpm,
        resolution: [self.canvas.width, self.canvas.height]
      })
    }

    // console.log("looping", self.o[0].fbo)
    if (self.renderAll) {
      renderAll({
        tex0: self.o[0].getTexture(),
        tex1: self.o[1].getTexture(),
        tex2: self.o[2].getTexture(),
        tex3: self.o[3].getTexture(),
        resolution: [self.canvas.width, self.canvas.height]
      })
    } else {
    //  console.log('out', self.output.id)
      renderFbo({
        tex0: self.output.getCurrent(),
        resolution: [self.canvas.width, self.canvas.height]
      })
    }
  }).start()
}

module.exports = hydraSynth
