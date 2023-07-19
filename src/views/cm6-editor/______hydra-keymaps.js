
import { getLine, getBlock, getSelection, getAll } from './flash-code/flashKeymaps.js'
import hydraKeys from './_____keymap-config.js'

// let evalLinter = new Compartment
export default Object.entries(hydraKeys).map(([key, val]) => ({
    key: key,
    run: (view) => {
        console.log('called event', val, view)
        let text = ''
        if (val === 'editor:evalLine') {
            text = getLine(view)
        } else if (val === 'editor:evalBlock') {
            text = getBlock(view)
        } else if (val === 'editor:evalAll') {
            text = getAll(view)
        } else if (val === 'hideAll') {
            // self.toggle()
        } else if (val === 'editor:formatCode') {
            // console.log('format code!')
           // self.formatCode()
        } else if (val == 'editor:saveToLocalStorage') {
           // this.emit('editor:save', this.cm.state.doc.toString())
        }
     //   self.emit(val, text)
        // setTimeout(() => { 
    //    view.dispatch({
    //         effects: evalLinter.reconfigure(linter(jsLinter()))
    //     })
        // forceLinting(self.cm) 
        //}, 100)
    }
}))