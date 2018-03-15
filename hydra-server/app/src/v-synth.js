// syntax
// init sources, 6 sources, default to framebuffer?? or canvas?? other possibilities are html page,
// canvas with somthing else, pass in id of element. if in extension, pass in existing element with id
// s[0].initCam
// s[1].initRemote('sss')
// s[2].initGen('osc')
// s[3].initVid

// output syntax::
// o[0] = blend(o[1], o[2], 'displace')
// o[1] = osc(20).rotate(5).rep(10).pulse(8).noise(40)
// o[2] = modulate(osc(20).rotate(5).rep(10).pulse(8).noise(40), s[2])
//
// how to handle changing over time? possible to set sync? i.e. rotate(5, true) would be moving, no argument would be still?
//
// try - catch for evaluating statements?
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
  canvas.style.width = "100%"
  canvas.style.height = "100%"
  this.regl = require('regl')(canvas)
  this.canvas = canvas
  this.o = []
  this.s = []
//  this.o = []
  this.time = 0
  this.audio = new AudioUtils()
  window.audio = this.audio
  //o[0] = on screen canvas
  // ctx.fillStyle = "rgb("+Math.floor(Math.random()*255) +","+ Math.floor(Math.random()*255)+"," + Math.floor(Math.random()*255) +")"
  // ctx.fillRect(0, 0, this.o[0].width, this.o[0].height)
  document.body.appendChild(canvas)
  //o[1] = if broacast enabled, o[1] is set to broadcast canvas, default is same as o[0]
  // if(opts.networked) {
  //   this.o[1] = this.o[0]
  // }

  //window.vs = this

  // This clears the color buffer to black and the depth buffer to 1
  this.regl.clear({
    color: [0, 0, 0, 1]//,
  //  depth: 1
  })





  for(var i = 0; i < NUM_OUTPUTS; i ++){
    this.o[i] = new Output({regl: this.regl, width: WIDTH, height: HEIGHT})
    this.o[i].render()
    window['o'+i] = this.o[i]
  }
  for(var i = 0; i < NUM_SOURCES; i ++){
      this.s[i] = new Source({regl: this.regl, pb: this.pb})
      window['s'+i] = this.s[i]
  }

  this.renderAll = false
  var self = this


  this.outputTex = this.o[0].getTexture()
  //receives which output to render. if no arguments, renders grid of all fbos
  window.render = function(output){
    this.output = output
    if(output) {
      self.renderAll = false
      self.outputTex = ()=>output.getCurrent()
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
      position: [[-2, 0],
      [0, -2],
      [2, 2]]
    },
    uniforms: {
      tex0: ()=>o0.getCurrent()
    },
    count: 3,
    depth: { enable: false }
  })

  //to do: dynamically set fbos in render all based on NUM_OUTPUTS
  //or render all into single texture?? how does regl multiplex work?
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
      position: [[-2, 0],
      [0, -2],
      [2, 2]]
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
  var engine = loop(function(dt) {
  //this.regl.frame(function () {
    self.time += dt*0.001
    //console.log(self.time)
    self.regl.clear({
      color: [0, 0, 0, 1]
    })
    for(var i = 0; i < NUM_SOURCES; i++){
      self.s[i].tick(self.time)
    }

    for(var i = 0; i < NUM_OUTPUTS; i++){
      self.o[i].tick({
        time: self.time,
        mouse: mouse,
        bpm: self.audio.bpm
      })
    }

    //console.log("looping", self.o[0].fbo)
    if(self.renderAll){
      renderAll({
        tex0: self.o[0].getTexture(),
        tex1: self.o[1].getTexture(),
        tex2: self.o[2].getTexture(),
        tex3: self.o[3].getTexture()
      })
    } else {
      renderFbo({tex0: self.outputTex})
    }
  }).start()



// })
  //  self.s[0].tick(self.time)
    // delta time in milliseconds
//}).start()

}

vSynth.prototype.addStreamSource = function(stream){
  var newSource = new Source({regl: this.regl})
  newSource.init({type: 'stream', stream: stream})
  this.s.push(newSource)
  var index = this.s.length - 1
  window['s'+index] = this.s[index]
}

module.exports = vSynth
