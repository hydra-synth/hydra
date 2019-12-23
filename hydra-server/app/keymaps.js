module.exports = {
  init : ({ editor, gallery, menu, repl}) => {
    window.onkeydown = (e) => {
      if ( e.ctrlKey === true ) {
        if ( e.shiftKey === true ) {

          // shift - ctrl - enter: evalAll
          if ( e.keyCode === 13) {
            repl.eval(editor.getValue())
          }

          // shift - ctrl - G: share sketch
          if (e.keyCode === 71) {
            menu.shareSketch.bind(menu)
          }

          // shift - ctrl - h: toggle editor
          if (e.keyCode === 72) {
            editor.toggle()
          }

          // shift - ctrl - s: screencap
          if (e.keyCode === 83) {
            screencap()
          }
        } else {
          // ctrl-enter: evalLine
          if ( e.keyCode === 13) {
            console.log('eval line')
            repl.eval(editor.getLine())
          }
        }
      }

      if (e.altKey === true) {
        // alt - enter: evalBlock
        if ( e.keyCode === 13) {
          repl.eval(editor.getCurrentBlock().text)
        }
      }
    }
  }
}
