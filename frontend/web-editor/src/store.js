const Gallery  = require('./gallery.js')


module.exports = function store (state, emitter) {
    state.showInfo = true
    state.showUI = true

    const sketches = new Gallery(() => {
      // @todo create gallery store
      console.warn('gallery callback not let implemented')
    })

    emitter.on('shuffle sketches', function (count) {
     
    })

    emitter.on('format code', function (count) {
     
    })

    emitter.on('gallery:shareSketch', function (editor) {
     console.log('waiting to share', state.editor.editor.getValue())
    })

    emitter.on('show confirmation', function (count) {
     
    })

    emitter.on('clear all', function (count) {
     
    })

    emitter.on('hideAll', function() {
      state.showUI = !state.showUI
      emitter.emit('render')
    })

    emitter.on('toggle info', function (count) {
      state.showInfo = !state.showInfo
      emitter.emit('render')
    })

    

    emitter.on('mutate sketch', function () {

    })
  }