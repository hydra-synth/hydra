const PatchBay = require('./src/pb-live.js')
const HydraSynth = require('hydra-synth')
const Editor = require('./src/editor.js')
const Canvas = require('./src/canvas.js')
const loop = require('raf-loop')
const P5  = require('./src/p5-wrapper.js')
const Gallery  = require('./src/gallery.js')

function init () {
  window.pb = pb
  window.P5 = P5

  var canvas = Canvas(document.getElementById('hydra-canvas'))
  canvas.size()
  var pb = new PatchBay()
  var hydra = new HydraSynth({
    pb: pb,
    canvas: canvas.element,
    autoLoop: false})
  var editor = new Editor()
  var sketches = new Gallery(function(code) {
    console.log('code is', code)
    editor.cm.setValue(code)
      editor.evalAll()
  })

  pb.init(hydra.captureStream, {
    server: window.location.origin,
    room: 'iclc'
  })

  var engine = loop(function(dt) {
    hydra.tick(dt)
  }).start()
}

window.onload = init
