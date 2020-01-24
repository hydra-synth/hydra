module.exports = {
  init : ({ editor, gallery, menu, repl, log}) => {
    window.onkeydown = (e) => {
      if ( e.ctrlKey === true ) {
        if ( e.shiftKey === true ) {

          // shift - ctrl - enter: evalAll
          if ( e.keyCode === 13) {
            e.preventDefault()
            repl.eval(editor.getValue())
          }

          // shift - ctrl - G: share sketch
          if (e.keyCode === 71) {
              e.preventDefault()
            menu.shareSketch.bind(menu)
          }

          // shift - ctrl - h: toggle editor
          if (e.keyCode === 72) {
              e.preventDefault()
            editor.toggle()
            log.toggle()
          }

          // shift - ctrl - s: screencap
          if (e.keyCode === 83) {
              e.preventDefault()
            screencap()
          }
        } else {
          // ctrl-enter: evalLine
          if ( e.keyCode === 13) {
              e.preventDefault()
            console.log('eval line')
            repl.eval(editor.getLine())
          }
        }
        // ctrl - /: toggle comment
        if (e.keyCode === 191) {
            e.preventDefault()
          editor.cm.toggleComment()
        }
      }



      if (e.altKey === true) {
        // alt - enter: evalBlock
        if ( e.keyCode === 13) {
            e.preventDefault()
          repl.eval(editor.getCurrentBlock().text)
        }
      }
    }
  }
}
