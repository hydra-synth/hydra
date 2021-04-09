const hotkeys = require('hotkeys-js')

const commands = {
  evalAll: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    // repl.eval(editor.getValue(), (string, err) => {
    //   console.log('eval', err)
    //   if(!err) gallery.saveLocally(editor.getValue())
    // })
    menu.runAll()
  },
  shareSketch: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    menu.shareSketch()
  },
  formatCode: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    menu.formatCode()
  },
  saveToUrl: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    gallery.saveLocally(editor.getValue())
  },
  toggleEditor: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    editor.toggle()
    log.toggle()
  },
  screencap: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    screencap()
  },
  evalLine: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    //  console.log('eval line')
    repl.eval(editor.getLine())
  },
  toggleComment: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    editor.cm.toggleComment()
  },
  historyForward: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    // if(e.shiftKey === true) {
    //   editor.mutator.mutate({reroll: false})
    // } else {
    window.history.forward()
    //  }
  },
  historyBack: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    // if(e.shiftKey === true) {
    //   console.log('redoing')
    //   editor.mutator.doUndo()
    // } else {
    window.history.back()
    //  }
    //  editor.mutator.doUndo()
  },
  doRedo: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    editor.mutator.doRedo()
  },
  saveLocally: (e, { editor, gallery, menu, repl, log }) => {
    editor.mutator.mutate({ reroll: true, event: e })
    menu.formatCode()
    gallery.saveLocally(editor.getValue())
  },
  evalBlock: (e, { editor, gallery, menu, repl, log }) => {
    e.preventDefault()
    repl.eval(editor.getCurrentBlock().text)
  }
}

module.exports = {
  init: ({ editor, gallery, menu, repl, log, mapping }) => {
    // enable capturing in text area
    hotkeys.filter = function(event){
      return true;
    }

    const commandNames = Object.keys(mapping);
    for (const commandName of commandNames) {
      const hk = mapping[commandName];
      if (hk.enabled && typeof commands[commandName] === "function") {
        hotkeys(hk.key, function (e, handler) {
          commands[commandName](e, { editor, gallery, menu, repl, log });
        });
      }
    }
  }
}
