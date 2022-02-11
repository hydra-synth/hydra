const html = require('choo/html')
const Component = require('choo/component')
const HydraEditor = require('./editor/editor.js')

module.exports = class Editor extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
  }

  load (element) {
   this.editor = new HydraEditor(this.textEl)
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
