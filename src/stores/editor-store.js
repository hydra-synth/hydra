// to add:
// flash block, flash line, format code

export default function editorStore(state, emitter) {
    emitter.on('editor: randomize', function (evt) {
        const editor = state.editor.editor
        if (evt.shiftKey) {
            editor.mutator.doUndo();
        } else {
            editor.mutator.mutate({ reroll: false, changeTransform: evt.metaKey });
            editor.formatCode()
            emitter.emit('gallery: save locally', editor.getValue())
        }
    })

    emitter.on('editor: add code to top', (code) => {
        state.editor.editor.addCodeToTop(code)
    })

    emitter.on('editor: load code', (code) => {
        const editor = state.editor.editor
        editor.setValue(code)
    })

    // emitter.on('editor: eval all', function () {
    //     const editor = state.editor.editor
    //     const code = editor.getValue()
    //     // repl.eval(code, (string, err) => {
    //     //     editor.flashCode()
    //     //     if (!err) sketches.saveLocally(code)
    //     // })
    //     emitter.emit('repl: eval', code, (string, err) => {
    //         editor.flashCode()
    //         if (!err) emitter.emit('gallery: save locally', code)
    //         // sketches.saveLocally(code)
    //     })
    // })

}