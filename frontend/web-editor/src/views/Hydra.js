const html = require('choo/html')
const Component = require('choo/component')
const HydraSynth = require('hydra-synth')
const P5  = require('./../lib/p5-wrapper.js')
const PatchBay = require('./../lib/patch-bay/pb-live.js')



module.exports = class Hydra extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    state.hydra = this // hacky
    this.emit = emit
  }

  load (element) {
    let isIOS =
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream;
  let precisionValue = isIOS ? 'highp' : 'mediump'

    const pb = new PatchBay()

    const hydra = new HydraSynth({ pb: pb, detectAudio: true, canvas: element.querySelector("canvas"), precision: precisionValue})
    // console.log(hydra)
    this.hydra = hydra
     osc().out()

    pb.init(hydra.captureStream, {
      server: window.location.origin,
      room: 'iclc'
    })

    window.P5 = P5
    window.pb = pb
    this.emit('hydra loaded')
  }

  update (center) {
    return false
  }

  createElement ({ width = window.innerWidth, height = window.innerHeight} = {}) {

    return html`<div style="width:100%;height:100%;">
        <canvas class="bg-black" style="imageRendering:pixelated; width:100%;height:100%" width="${width}" height="${height}"></canvas></div>`
  }
}
