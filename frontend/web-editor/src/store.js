module.exports = function countStore (state, emitter) {
    state.count = 0
    emitter.on('increment', function (count) {
      state.count += count
      emitter.emit('render')
    })
  }