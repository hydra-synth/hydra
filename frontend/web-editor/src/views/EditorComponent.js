const html = require('choo/html')
const Component = require('choo/component')
const HydraEditor = require('./editor/editor.js')

module.exports = class Editor extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
    this.emit = emit
  }

  load (element) {
   this.editor = new HydraEditor(this.textEl)
   this.editor.on("*", (e, t) => {
       this.emit(e)
   })
  }

  update (center) {
    return false
  }

  createElement ({ width = window.innerWidth, height = window.innerHeight} = {}) {
    this.textEl = html` <textarea></textarea>`
    return html`<div id="editor-container">
        ${this.textEl}
       </div>`
  }
}
