const PatchBay = require('./src/pb-live.js')
const HydraSynth = require('hydra-synth')
const Editor = require('./src/editor.js')
const Canvas = require('./src/canvas.js')
const loop = require('raf-loop')
const P5  = require('./src/p5-wrapper.js')
const Gallery  = require('./src/gallery.js')
const request = require('superagent')

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

  window.hydra = hydra

  // variables related to popup window
  var close = document.getElementById("close-modal")
  var isClosed = false
  var l = document.getElementsByClassName('CodeMirror-scroll')[0]
  closeModal()

  var sketches = new Gallery(function(code, sketchFromURL) {
    console.log('code is', code)
    editor.cm.setValue(code)
    editor.evalAll()
    editor.saveSketch = (code) => {
      sketches.saveSketch(code)
    }

    editor.shareSketch = (code) => {
      sketches.shareSketch(code, hydra)
    }

    // if a sketch was found based on the URL parameters, dont show intro window
    if(sketchFromURL) {
      closeModal()
    } else {
      openModal()
    }
  })

  pb.init(hydra.captureStream, {
    server: window.location.origin,
    room: 'iclc'
  })

  var engine = loop(function(dt) {
    hydra.tick(dt)
  }).start()

// init GUI
    var shuffle = document.getElementById("shuffle")
    shuffle.onclick = () => {
      console.log("shuffle!!!")
      sketches.setRandomSketch()
      solid().out()
      solid().out(o1)
      solid().out(o2)
      solid().out(o3)
      render(o0)
      editor.cm.setValue(sketches.code)
      editor.evalAll()
    }


    close.onclick = () => {
      if(!isClosed) {
        closeModal()
      } else {
        openModal()
      }
    }

    function closeModal () {
      document.getElementById("info-container").className = "hidden"
      close.className = "fas fa-question-circle icon"
        l.style.opacity = 1
      isClosed = true
    }

    function openModal () {
      document.getElementById("info-container").className = ""
      close.className = "fas fa-times icon"
      l.style.opacity = 0.0
      isClosed = false
    }
}

window.onload = init
