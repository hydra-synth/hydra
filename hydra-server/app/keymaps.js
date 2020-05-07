module.exports = {
  init : ({ editor, gallery, menu, repl, log}) => {
    window.onkeydown = (e) => {
    //  console.log(e)
      if ( e.ctrlKey === true || e.metaKey === true ) {
        if ( e.shiftKey === true ) {
          console.log(e)
          // shift - ctrl - enter: evalAll
          if ( e.keyCode === 13) {
            e.preventDefault()
            // repl.eval(editor.getValue(), (string, err) => {
            //   console.log('eval', err)
            //   if(!err) gallery.saveLocally(editor.getValue())
            // })
            menu.runAll()
          }

          // shift - ctrl - G: share sketch
          if (e.keyCode === 71) {
              e.preventDefault()
            menu.shareSketch()
          }

          // shift - ctrl - F: format code
          if (e.keyCode === 70) {
            e.preventDefault()
            menu.formatCode()
          }

          // shift - ctrl - l: save to url
          if(e.keyCode === 76) {
            e.preventDefault()
            gallery.saveLocally(editor.getValue())
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
          //  console.log('eval line')
            repl.eval(editor.getLine())
          }
        }
        // ctrl - /: toggle comment
        if (e.keyCode === 191) {
            e.preventDefault()
          editor.cm.toggleComment()
        }

        // Point Mutation Glitcher Key Commands and history commands (left and right arrows)
        // right arrow key
        if(e.keyCode === 39) {
          e.preventDefault()
          // if(e.shiftKey === true) {
          //   editor.mutator.mutate({reroll: false})
          // } else {
            window.history.forward()
        //  }
        }
        // left arrow
        if(e.keyCode === 37) {
          e.preventDefault()
          // if(e.shiftKey === true) {
          //   console.log('redoing')
          //   editor.mutator.doUndo()
          // } else {
            window.history.back()
        //  }
        //  editor.mutator.doUndo()
        }
        // up arrow
        if(e.keyCode === 38) {
          e.preventDefault()
          editor.mutator.doRedo()
        }
        // down arrow
        if(e.keyCode === 40)  {
          editor.mutator.mutate({reroll: true})
          gallery.saveLocally(editor.getValue())
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
