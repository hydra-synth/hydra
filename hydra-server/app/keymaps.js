module.exports = {
  init : ({ editor, gallery, menu, repl, log}) => {
    window.onkeydown = (e) => {
      console.log(e)
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

          // shift - ctrl - k: clear graphics
          if (e.keyCode === 75) {
            e.preventDefault()
            hush()
          }

          // shift - ctrl - l: toggle log
          if (e.keyCode === 76) {
            e.preventDefault()
            log.toggle()
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

        // Point Mutation Glitcher Key Commands
        // right arrow key
        if(e.keyCode === 39) {
          e.preventDefault()
          editor.mutator.mutate({reroll: false})
        }
        // left arrow
        if(e.keyCode === 37) {
          e.preventDefault()
          editor.mutator.doUndo()
        }
        // up arrow
        if(e.keyCode === 38) {
          e.preventDefault()
          editor.mutator.doRedo()
        }
        // down arrow
        if(e.keyCode === 40)  {
          editor.mutator.mutate({reroll: true})
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
