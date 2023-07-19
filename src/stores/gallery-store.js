import Gallery from './gallery.js'
let sketches

export default function galleryStore(state, emitter) {
    emitter.on('DOMContentLoaded', function () {
   
        sketches = new Gallery((code, sketchFromURL) => {
          emitter.emit('load and eval code', code)
          if(sketchFromURL) {
            emitter.emit('ui: hide info')
          } else {
            emitter.emit('ui: show info')
          }
          emitter.emit('render')
          // @todo create gallery store
        //  console.warn('gallery callback not let implemented')
        }, state, emitter)
    
        state.gallery = sketches
      })

      // redundant with below
      emitter.on('gallery:saveToURL', function () {
        let editor = state.editor.editor
        const editorText = editor.getValue()
        sketches.saveLocally(editorText)
      }) 
      
      // save to url
      emitter.on('gallery: save locally', function (code) {
        // let editor = state.editor.editor
        // const editorText = editor.getValue()
        sketches.saveLocally(code)
      }) 

      emitter.on('gallery: clear', () => {
        sketches.clear()
      })

      emitter.on('gallery:shareSketch', function () {
        let editor = state.editor.editor
        const editorText = editor.getValue()
        emitter.emit('repl: eval', editorText, (code, error) => {
            if (!error) {
                showConfirmation((name) => {
                  sketches.shareSketch(editorText, state.hydra.hydra, name)
                }, () => { })
              } else {
                console.warn(error)
              }
        })
        // repl.eval(editor.getValue(), (code, error) => {
        //   //  console.log('evaluated', code, error)
         
        // })
      })

      emitter.on('gallery:showExample', () => {
        const editor = state.editor.editor
        emitter.emit('clear all')
        sketches.setRandomSketch()
        emitter.emit('repl: eval', sketches.code)
        editor.setValue(sketches.code)
       // repl.eval(editor.getValue())
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