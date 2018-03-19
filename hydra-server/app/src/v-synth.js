
//
const Output = require('./output.js')
const loop = require('raf-loop')
const Source = require('./source.js')
const Generator = require('./Generator.js')
const mouse = require('mouse-change')()
const AudioUtils = require('./audioUtils.js')

var NUM_OUTPUTS = 4
var NUM_SOURCES = 4

var WIDTH = 1280
var HEIGHT = 720

var vSynth = function (opts) {
  window.src = Generator

  this.pb = opts.pb ? opts.pb : null
  var canvas = document.createElement('canvas')
  // var ctx = this.o[0].getContext('2d')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  this.regl = require('regl')({
    canvas: canvas,
    pixelRatio: 1,
    extensions: [
      'oes_texture_half_float',
      'oes_texture_half_float_linear'
    ],
    optionalExtensions: [
      'oes_texture_float',
      'oes_texture_float_linear'
    ]})
  this.canvas = canvas
  this.o = []
  this.s = []
  this.time = 0
  this.audio = new AudioUtils()
  window.audio = this.audio
  document.body.appendChild(canvas)

  // This clears the color buffer to black and the depth buffer to 1
  this.regl.clear({
    color: [0, 0, 0, 1]
  })

  for (let i = 0; i < NUM_OUTPUTS; i++) {
    this.o[i] = new Output({regl: this.regl, width: WIDTH, height: HEIGHT})
    this.o[i].render()
    this.o[i].id = i
    window['o' + i] = this.o[i]
  }
  this.output = this.o[0]
  for (let i = 0; i < NUM_SOURCES; i++) {
    this.s[i] = new Source({regl: this.regl, pb: this.pb})
    window['s' + i] = this.s[i]
  }

  this.renderAll = false
  var self = this
  // receives which output to render. if no arguments, renders grid of all fbos
  window.render = function (output) {
    if (output) {
      self.output = output
      self.renderAll = false
    } else {
      self.renderAll = true
    }
  }

  var renderFbo = this.regl({
    frag: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex0;

    void main () {
      gl_FragColor = texture2D(tex0, vec2(1.0)-uv);
      //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `,
    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;

    void main () {
      uv = position;
      gl_Position = vec4(2.0 * position-1.0, 0, 1);
    }`,
    attributes: {
      position: [
        [-2, 0],
        [0, -2],
        [2, 2]
      ]
    },
    uniforms: {
      tex0: this.regl.prop('tex0')
    },
    count: 3,
    depth: { enable: false }
  })

  // to do: dynamically set fbos in render all based on NUM_OUTPUTS
  // or render all into single texture?? how does regl multiplex work?
  var renderAll = this.regl({
    frag: `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D tex0;
    uniform sampler2D tex1;
    uniform sampler2D tex2;
    uniform sampler2D tex3;

    void main () {
      vec2 st = uv;
      st*= vec2(2);
      vec2 q = floor(st).xy*(vec2(2.0, 1.0));
      int quad = int(q.x) + int(q.y);
      st.x += step(1., mod(st.y,2.0));
      st.y += step(1., mod(st.x,2.0));
      st = fract(st);
      if(quad==0){
        gl_FragColor = texture2D(tex0, vec2(1.0)-st);
      } else if(quad==1){
        gl_FragColor = texture2D(tex1, vec2(1.0)-st);
      } else if (quad==2){
        gl_FragColor = texture2D(tex2, vec2(1.0)-st);
      } else {
        gl_FragColor = texture2D(tex3, vec2(1.0)-st);
      }

    }
    `,
    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;

    void main () {
      uv = position;
      gl_Position = vec4(2.0 * position-1.0, 0, 1);
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
    for (let i = 0; i < NUM_SOURCES; i++) {
      self.s[i].tick(self.time)
    }

    for (let i = 0; i < NUM_OUTPUTS; i++) {
      self.o[i].tick({
        time: self.time,
        mouse: mouse,
        bpm: self.audio.bpm,
        resolution: [WIDTH, HEIGHT]
      })
    }

    // console.log("looping", self.o[0].fbo)
    if (self.renderAll) {
      renderAll({
        tex0: self.o[0].getTexture(),
        tex1: self.o[1].getTexture(),
        tex2: self.o[2].getTexture(),
        tex3: self.o[3].getTexture()
      })
    } else {
      console.log('out', self.output.id)
      renderFbo({tex0: self.output.getCurrent()})
    }
  }).start()
}

vSynth.prototype.addStreamSource = function (stream) {
  var newSource = new Source({regl: this.regl})
  newSource.init({type: 'stream', stream: stream})
  this.s.push(newSource)
  var index = this.s.length - 1
  window['s' + index] = this.s[index]
}

module.exports = vSynth
