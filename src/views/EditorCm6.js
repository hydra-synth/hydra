

import html from 'choo/html'
import Component from 'choo/component'
// import HydraEditor from './editor/editor.js'
import HydraEditor from './cm6-editor/editor.js'
import log from './editor/log.js'

export default class Editor extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    state.editor = this // hacky way fo sharing editor to rest of app
    this.emit = emit
  }

  load (element) {
   log.init(this.logElement)
   this.editor = new HydraEditor(this.textEl, this.emit)
  //  this.editor.on("*", (e, args) => {
  //      this.emit(e, args)
  //  })
   // hacky, maybe not necessary
  //  this.innerText = document.getElementsByClassName('CodeMirror')[0]
   this.textEl.style.transition = 'opacity 0.5s'
  }

  hide() {
    this.textEl.style.opacity = 0
    this.logElement.style.display = 'none'
  }

  show() {
    this.textEl.style.opacity = 1
    this.textEl.style.pointerEvents = 'all'
    this.logElement.style.display = 'block'
  }

  update (state) {
    if(state.showInfo === true && state.showExtensions === false || state.showUI === false) {
        this.hide()
    } else {
        this.show()
    }
    const msg = state.errorMessage
    const className = state.isError ? 'log-error' : ''
    console.log('UPDATING LOG updating state', state)
    this.logElement.innerHTML = ` >> <span class=${className}> ${msg} </span> `
    return false
  }

  createElement ({ width = window.innerWidth, height = window.innerHeight} = {}) {
    this.textEl = html` <div></div>`
    this.logElement = html`<div class="console cm-s-tomorrow-night-eighties"></div>`
    return html`<div id="editor-container" style="display:flex;flex-direction:column;">
       <div style="position:relative;flex:auto;padding:15px">${this.textEl}</div>
       ${this.logElement}
       </div>`
  }
}
