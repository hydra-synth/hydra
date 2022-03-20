const html = require('choo/html')
const info = require('./info.js')
const Hydra = require('./Hydra.js')
const Editor = require('./EditorComponent.js')

module.exports = function mainView(state, emit) {
  return html`
  <body>
    <div id="hydra-ui">
      ${state.cache(Hydra, 'hydra-canvas').render(state, emit)}
      <!---<canvas id="audio-canvas">
      </canvas>--->
    </div>
  ${info(state, emit)}
  ${state.cache(Editor, 'editor').render(state, emit)}
  </body>
 `
}