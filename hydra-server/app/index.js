const PatchBay = require('./src/pb-live.js')
const HydraSynth = require('./src/hydra-synth.js')
const Editor = require('./src/editor.js')

function init () {
  // console.log("loaded", document.getElementById('code'))
  var pb = new PatchBay()
  var hydra = new HydraSynth({pb: pb})
  var editor = new Editor()
  editor.eval()
  var localStream = hydra.canvas.captureStream()
  pb.init(localStream, {
    server: window.location.origin,
    room: 'iclc'
  })
}

window.onload = init
