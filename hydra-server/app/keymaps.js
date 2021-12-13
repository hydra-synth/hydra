module.exports = {
  init: ({ editor, gallery, menu, repl, log }) => {
    window.onkeydown = (e) => {
      if (e.ctrlKey === true) {
        if (e.shiftKey === true) {
          // shift - ctrl - enter: evalAll
          if (e.keyCode === 13) {
            e.preventDefault()
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
          if (e.keyCode === 76) {
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

          // Point Mutation Glitcher Key Commands and history commands (left and right arrows)
          // right arrow key
          if (e.keyCode === 39) {
            e.preventDefault()
            window.history.forward()
          }
          // left arrow
          if (e.keyCode === 37) {
            e.preventDefault()
            window.history.back()
          }
          // up arrow
          if (e.keyCode === 38) {
            e.preventDefault()
            editor.mutator.doRedo()
          }
          // down arrow
          if (e.keyCode === 40) {
            editor.mutator.mutate({ reroll: true, event: e })
            menu.formatCode()
            gallery.saveLocally(editor.getValue())
          }
        } else {
          // ctrl-enter: evalLine
          if (e.keyCode === 13) {
            e.preventDefault()
            //  console.log('eval line')
            repl.eval(editor.getLine())
          }

          // ctrl - /: toggle comment
          if (e.keyCode === 191) {
            e.preventDefault()
            editor.cm.toggleComment()
          }
        }
      }

      if (e.altKey === true) {
        // alt - enter: evalBlock
        if (e.keyCode === 13) {
          e.preventDefault()
          repl.eval(editor.getCurrentBlock().text)
        }
      }
    }
  }
}
