// to add:
// flash block, flash line, format code
import { syntaxTree } from "@codemirror/language"


export default function editorStore(state, emitter) {
    emitter.on('editor: randomize', function (evt) {
        const editor = state.editor.editor

        const view = editor.cm
        let text = view.state.doc.toString()
        let tree = syntaxTree(view.state)
        // arguments of CallExpression and arguments of Member Expressiong
        // find all numbers /// nodes of interest

        // find all of the numbers

        //.resolveInner(next, -1)

        console.log('RANDIMIZING', editor, text, tree)

        // 

        // if (evt.shiftKey) {
        //     editor.mutator.doUndo();
        // } else {
        //     // editor.mutator.mutate({ reroll: false, changeTransform: evt.metaKey });
        //     editor.formatCode()
        //     emitter.emit('gallery: save to URL', editor.getValue())
        // }
    })

    emitter.on('editor: add code to top', (code) => {
        state.editor.editor.addCodeToTop(code)
    })

    // emitter.on('editor: eval all', () => {
    //     const code = editor.getValue()
    //     state.editor.editor.flashCode()
    // })

    emitter.on('editor: format code', () => {
        state.editor.editor.formatCode()
    })

    emitter.on('editor: load code', (code) => {
        const editor = state.editor.editor
        editor.setValue(code)
    })

    emitter.on('editor: eval all', function () {
        const editor = state.editor.editor
        const code = editor.getValue()
        // repl.eval(code, (string, err) => {
        //     editor.flashCode()
        //     if (!err) sketches.saveLocally(code)
        // })
        emitter.emit('repl: eval', code, (string, err) => {
            editor.flashCode()
            if (!err) emitter.emit('gallery: save to URL', code)
            // sketches.saveLocally(code)
        })
    })

}