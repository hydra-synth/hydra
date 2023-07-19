export default function editorStore(state, emitter) {
    emitter.on('editor: randomize', function (evt) {
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

    emitter.on('editor: eval all', function () {
        const editor = state.editor.editor
        const code = editor.getValue()
        repl.eval(code, (string, err) => {
            editor.flashCode()
            if (!err) sketches.saveLocally(code)
        })
    })

    emitter.on('editor: eval line', (line) => {
        repl.eval(line)
    })

    emitter.on('editor:evalBlock', (block) => {
        repl.eval(block)
    })
}