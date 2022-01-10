const PatchBay = require('./src/patch-bay/pb-live.js')
const HydraSynth = require('./../../hydra-synth')
const Editor = require('./src/editor/editor.js')
const loop = require('raf-loop')
const P5  = require('./src/p5-wrapper.js')
const Gallery  = require('./src/gallery.js')
const Menu = require('./src/menu.js')
const keymaps = require('./keymaps.js')
const log = require('./src/editor/log.js')
const repl = require('./src/repl.js')

function init () {
  window.pb = pb
  window.P5 = P5

  var canvas = document.getElementById('hydra-canvas')
  // canvas.width = window.innerWidth * window.devicePixelRatio
  // canvas.height = window.innerHeight * window.devicePixelRatio
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight 
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.imageRendering = 'pixelated'

  let isIOS =
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream;

  let precisionValue = isIOS ? 'highp' : 'mediump'

  var pb = new PatchBay()
  var hydra = new HydraSynth({ pb: pb, canvas: canvas, autoLoop: false,  precision: precisionValue})
  var editor = new Editor()
  var menu = new Menu({ editor: editor, hydra: hydra})
  log.init()

  // add extra functions to the web editor
   // hush clears what you see on the screen
   window.hush = () => {
    solid().out()
    solid().out(o1)
    solid().out(o2)
    solid().out(o3)
    render(o0)
  }

  window.loadScript = (url = "") => {
    const p = new Promise((res, rej) => {
      var script = document.createElement("script");
      script.onload = function () {
        log.log(`loaded script ${url}`);
        res();
      };
      script.onerror = (err) => {
        log.log(`error loading script ${url}`, "log-error");
        res()
      };
      script.src = url;
      document.head.appendChild(script); 
    });
    return p;
  };

  // get initial code to fill gallery
  var sketches = new Gallery(function(code, sketchFromURL) {
    editor.setValue(code)
    repl.eval(code)

    // if a sketch was found based on the URL parameters, dont show intro window
    if(sketchFromURL) {
      menu.closeModal()
    } else {
      menu.openModal()
    }
  })
  menu.sketches = sketches

  keymaps.init ({
    editor: editor,
    gallery: sketches,
    menu: menu,
    repl: repl,
    log: log
  })

  // define extra functions (eventually should be added to hydra-synth?)

 

  pb.init(hydra.captureStream, {
    server: window.location.origin,
    room: 'iclc'
  })

  var engine = loop(function(dt) {
    hydra.tick(dt)
  }).start()

}

window.onload = init
