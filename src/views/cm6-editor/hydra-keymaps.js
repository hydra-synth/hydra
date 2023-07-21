const keymap = { 
    // 'Ctrl-Enter': 'editor: eval line',
    'Ctrl-/': 'editor:toggleComment',
    // 'Alt-Enter': 'editor:evalBlock',
    // 'Shift-Ctrl-Enter': 'editor: eval all',
    'Shift-Ctrl-g': 'gallery:shareSketch',
    'Shift-Ctrl-f': 'editor: format code',
    'Shift-Ctrl-l': 'gallery:saveToURL',
    'Shift-Ctrl-h': 'ui: hide all',
    'Shift-Ctrl-s': 'screencap'
}

export default (emit) => {
    const keymapsArray = Object.entries(keymap).map(([key, val]) => {
        return {
        key: key,
        run: () => { emit(val) }
      }})
    return keymapsArray
}