

import html from 'choo/html'
import Component from 'choo/component'
import HydraEditor from './editor/editor.js'
// import HydraEditor from './editor-cm6/editor.js'
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
   this.editor = new HydraEditor(this.textEl)
   this.editor.on("*", (e, args) => {
       this.emit(e, args)
   })
   // hacky, maybe not necessary
   this.innerText = document.getElementsByClassName('CodeMirror')[0]
   this.innerText.style.transition = 'opacity 0.5s'
  }

  hide() {
    this.innerText.style.opacity = 0
    this.logElement.style.opacity = 0
  }

  show() {
    this.innerText.style.opacity = 1
    this.innerText.style.pointerEvents = 'all'
    this.logElement.style.opacity = 1
  }

  update (state) {
    if(state.showInfo === true && state.showExtensions === false || state.showUI === false) {
        this.hide()
    } else {
        this.show()
    }
    const msg = state.errorMessage
    const className = state.isError ? 'log-error' : ''
    this.logElement.innerHTML = ` >> <span class=${className}> ${msg} </span> `
    return false
  }

  createElement ({ width = window.innerWidth, height = window.innerHeight} = {}) {
    this.textEl = html` <textarea></textarea>`
    this.logElement = html`<div class="console cm-s-tomorrow-night-eighties"></div>`
    return html`<div id="editor-container" style="display:flex;flex-direction:column;">
       <div style="position:relative;flex:auto;padding:15px">${this.textEl}</div>
       ${this.logElement}
       </div>`
  }
}
