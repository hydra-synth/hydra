const html = require('choo/html')
const info = require('./info.js')
const Hydra = require('./Hydra.js')

module.exports = function mainView (state, emit) {
    return html`
    <body>
    <div id="hydra-ui">
  
    ${state.cache(Hydra, 'hydra-canvas').render(state, emit)}

    <canvas id="audio-canvas">
    </canvas>
  </div>
  ${info(state, emit)}
  </body>
 `
  
    function onclick () {
      emit('increment', 1)
    }
  }