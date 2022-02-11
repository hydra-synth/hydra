const Gallery  = require('./gallery.js')
const repl = require('./views/editor/repl.js')

module.exports = function store (state, emitter) {
    state.showInfo = true
    state.showUI = true

    const sketches = new Gallery(() => {
      // @todo create gallery store
      console.warn('gallery callback not let implemented')
    })

    emitter.on('shuffle sketches', function (count) {
     
    })

    
    emitter.on('editor:randomize', function(evt) {
      const editor = state.editor.editor
      if (evt.shiftKey) {
        editor.mutator.doUndo();
      } else {
        editor.mutator.mutate({reroll: false, changeTransform: evt.metaKey});
        editor.formatCode()
        sketches.saveLocally(editor.getValue())
      }
    })

    function clearAll () {
      const editor = state.editor.editor
      hush()
      speed = 1
      sketches.clear()
      editor.clear()
    }

    emitter.on('editor:clearAll', function () {
      clearAll()
    })

    emitter.on('editor:evalAll', function () {
    const editor = state.editor.editor
     const code = editor.getValue()
     repl.eval(code, (string, err) => {
      editor.flashCode()
      if(!err) sketches.saveLocally(code)
     })
    })

    emitter.on('editor:evalLine', (line) => {
      repl.eval(line)
    })

    emitter.on('editor:evalBlock', (block) => {
      repl.eval(block)
    })

    emitter.on('gallery:shareSketch', function (editor) {
     console.log('waiting to share', state.editor.editor.getValue())
    })

    emitter.on('gallery:showExample', () => {
      const editor = state.editor.editor
      clearAll()
      sketches.setRandomSketch()
      editor.setValue(sketches.code)
      repl.eval(editor.getValue())
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