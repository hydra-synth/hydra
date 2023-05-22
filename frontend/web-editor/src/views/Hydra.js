import html from "choo/html"
import Component from "choo/component"
import HydraSynth from "hydra-synth"
import P5 from "./../lib/p5-wrapper.js"
import PatchBay from "./../lib/patch-bay/pb-live.js"



export default class Hydra extends Component {
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
