module.exports = function countStore (state, emitter) {
    state.showInfo = true
    state.showUI = true

    emitter.on('shuffle sketches', function (count) {
     
    })

    emitter.on('format code', function (count) {
     
    })

    emitter.on('share sketch', function (count) {
     
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