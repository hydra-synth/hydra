const PatchBay = require('./src/pb-live.js')
const HydraSynth = require('hydra-synth')
const Editor = require('./src/editor.js')
const Canvas = require('./src/canvas.js')
const loop = require('raf-loop')
const VidRecorder = require('./src/video-recorder.js')

function init () {
  var canvas = Canvas(document.getElementById('hydra-canvas'))
  canvas.size()
  var pb = new PatchBay()
  var hydra = new HydraSynth({
    pb: pb,
    canvas: canvas.element,
    autoLoop: false})
  var editor = new Editor()
  editor.eval()
  var localStream = hydra.canvas.captureStream(25)
  window.vidRecorder = new VidRecorder(localStream)
  pb.init(localStream, {
    server: window.location.origin,
    room: 'iclc'
  })
 window.pb = pb
  var engine = loop(function(dt) {
    hydra.tick(dt)
}).start()
}

window.onload = init
