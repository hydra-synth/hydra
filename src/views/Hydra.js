import html from 'choo/html'
import Component from 'choo/component'
// import Hydra from 'hydra-synth'
// const HydraSynth = require('./../../../../../hydra-synth')
import P5 from './../lib/p5-wrapper.js'
import PatchBay from './../lib/patch-bay/pb-live.js'
import { log } from './editor/log.js'

let pb

// const SERVER_URL = process.env['SERVER_URL']

export default class HydraCanvas extends Component {
  constructor(id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    state.hydra = this // hacky
    this.state = state
    this.emit = emit
  }

  load(element) {
    let isIOS =
      (/iPad|iPhone|iPod/.test(navigator.platform) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
      !window.MSStream;
    let precisionValue = isIOS ? 'highp' : 'mediump'

    // Handle errors from Hydra (syntax, runtime, load errors)
    const onError = (error) => {
      let msg = error.message || String(error)
      if (error.line != null) {
        msg += ` (line ${error.line}${error.column != null ? ':' + error.column : ''})`
      }
      if (error.suggestion) {
        msg += ` - ${error.suggestion}`
      }
      log(msg, 'log-error')
    }

    const hydraOptions = { detectAudio: true, canvas: element.querySelector("canvas"), precision: precisionValue, onError }
    
    if (!this.state.serverURL) {
      console.log('LOCAL ONLY, WILL NOT INIT webRTC and gallery')
      this.hydra = new Hydra(hydraOptions)
    } else {
      this.pb = new PatchBay()
      hydraOptions.pb = this.pb
      this.hydra = new Hydra(hydraOptions)
      this.pb.init(this.hydra.captureStream, {
        // server: window.location.origin,
        server: this.state.serverURL,
        room: 'iclc'
      })
      window.pb = this.pb
    }

    window.hydraSynth = this.hydra
    //  if(environment !== 'local') {
    // osc().out()

    // }

    window.P5 = P5
    // window.pb = pb
    this.emit('hydra loaded')
  }

  update(center) {
    return false
  }

  createElement({ width = window.innerWidth, height = window.innerHeight } = {}) {

    return html`<div style="width:100%;height:100%;">
        <canvas id="hydra-canvas" class="bg-black" style="image-rendering:pixelated; width:100%;height:100%" width="${width}" height="${height}"></canvas></div>`
  }
}
