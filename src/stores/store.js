import Gallery from './gallery.js'
import repl from '../views/editor/repl.js'
// console.log('ENVIRONMENT IS', process.env.NODE_ENV)

export default function store(state, emitter) {
  state.showInfo = true
  state.showUI = true
  state.showExtensions = false

  // if backend gallery endpoint supplied, then enable gallery functionality
  const SERVER_URL = import.meta.env.VITE_SERVER_URL
  state.serverURL = SERVER_URL !== undefined ? SERVER_URL : null
 let sketches

  emitter.on('DOMContentLoaded', function () {
   
    sketches = new Gallery((code, sketchFromURL) => {
      emitter.emit('load and eval code', code)
      if(sketchFromURL) {
        state.showInfo = false
      } else {
        state.showInfo = true
      }
      emitter.emit('render')
      // @todo create gallery store
    //  console.warn('gallery callback not let implemented')
    }, state, emitter)

    state.gallery = sketches
  })

  emitter.on('load and eval code', (code) => {
    const editor = state.editor.editor
    editor.setValue(code)
    repl.eval(code)
  })

  emitter.on('screencap', () => {
    screencap()
    const editor = state.editor.editor
    const text = editor.getValue()
    const data = new Blob([text], {type: 'text/plain'});
    const a = document.createElement('a')
    a.style.display = 'none'
    let d = new Date()
    a.download = `hydra-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}.js`
    a.href = URL.createObjectURL(data)
    a.click()

    setTimeout(() => {
      window.URL.revokeObjectURL(a.href);
    }, 300);
  })

  emitter.on('editor:randomize', function (evt) {
    const editor = state.editor.editor
    if (evt.shiftKey) {
      editor.mutator.doUndo();
    } else {
      editor.mutator.mutate({ reroll: false, changeTransform: evt.metaKey });
      editor.formatCode()
      sketches.saveLocally(editor.getValue())
    }
  })

  emitter.on('editor: add code to top', (code) => {
    state.editor.editor.addCodeToTop(code)
  })

  function clearAll() {
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
      if (!err) sketches.saveLocally(code)
    })
  })

  emitter.on('editor:evalLine', (line) => {
    repl.eval(line)
  })

  emitter.on('editor:evalBlock', (block) => {
    repl.eval(block)
  })

  emitter.on('gallery:saveToURL', function () {
    let editor = state.editor.editor
    const editorText = editor.getValue()
    sketches.saveLocally(editorText)
  })

  emitter.on('gallery:shareSketch', function () {
    let editor = state.editor.editor
    const editorText = editor.getValue()
    repl.eval(editor.getValue(), (code, error) => {
      //  console.log('evaluated', code, error)
      if (!error) {
        showConfirmation((name) => {
          sketches.shareSketch(editorText, state.hydra.hydra, name)
        }, () => { })
      } else {
        console.warn(error)
      }
    })
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

  emitter.on('hideAll', function () {
    state.showUI = !state.showUI
    emitter.emit('render')
  })

  emitter.on('toggle info', function (count) {
    if(state.showInfo) {
      state.showInfo = false
      state.showExtensions = false
    } else {
      state.showInfo = true
    }
    // state.showInfo = !state.showInfo
    emitter.emit('render')
  })

  // emitter.on('hide info', function (count) {
  //   state.showInfo = false
  //   state.showExtensions = false
  //   emitter.emit('render')
  // })

  emitter.on('show extensions', () => {
    state.showExtensions = true
    state.showInfo = true
    emitter.emit('extensions: select category')
    emitter.emit('render')
  })

  emitter.on('hide extensions', () => {
    state.showExtensions = false
    emitter.emit('render')
  })



  emitter.on('mutate sketch', function () {

  })
}

function showConfirmation(successCallback, terminateCallback) {
  var c = prompt("Pressing OK will share this sketch to \nhttps://twitter.com/hydra_patterns.\n\nInclude your name or twitter handle (optional):")
  //  console.log('confirm value', c)
  if (c !== null) {
    successCallback(c)
  } else {
    terminateCallback()
  }
}