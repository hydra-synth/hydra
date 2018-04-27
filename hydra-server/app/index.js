const PatchBay = require('./src/pb-live.js')
const HydraSynth = require('hydra-synth')
//const HydraSynth = require('./../../../hydra-synth/index.js')
const Editor = require('./src/editor.js')
const Canvas = require('./src/canvas.js')
const Audio = require('./src/audio.js')
const loop = require('raf-loop')

function init () {
  var audio = new Audio({
    numBins: 3,
    cutoff: 2
  })
  window.a = audio
  // console.log("loaded", document.getElementById('code'))
  var canvas = Canvas(document.getElementById('hydra-canvas'))
  canvas.size()
  console.log("canvas size", document.getElementById('hydra-canvas').width, document.getElementById('hydra-canvas').height)
  var pb = new PatchBay()
  var hydra = new HydraSynth({
    pb: pb,
    canvas: canvas.element,
    autoLoop: false})
  var editor = new Editor()
  editor.eval()
  var localStream = hydra.canvas.captureStream(25)
  pb.init(localStream, {
    server: window.location.origin,
    room: 'iclc'
  })
 window.pb = pb
  var engine = loop(function(dt) {
    // delta time in milliseconds
    hydra.tick(dt)
    audio.tick()
}).start()
}

window.onload = init
