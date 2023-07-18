import extensions from './hydra-extensions.json'


export default function store(state, emitter) {
    state.extensions = {
        categories: ['extensions', 'external libraries', 'examples'],
        selectedCategoryIndex: 0,
        extensions: extensions,
        selectedExtension: null
    }

    emitter.on('extensions: select category', (index) => {
        state.extensions.selectedCategoryIndex = index
        emitter.emit('render')
    })

    emitter.on('extensions: add to editor', (index) => {
        const code = extensions[index].load
        emitter.emit('editor: add code to top', code)
    })

    // emitter.on('extensions: select extension', (index) => {
    //     // if(index === state.extensions.selectedExtension) {

    //     // }
    //     state.extensions.selectedExtension = index
    //     emitter.emit('render')
    // })

    emitter.on('extensions: load example', (extensionIndex, exampleIndex) => {
        const path = state.extensions.extensions[extensionIndex].examples[exampleIndex]
        const url = new URL(path);
        console.log(url)

        state.gallery.setSketchFromURL(url.search, (code) => {
            emitter.emit('load and eval code', code)
        })
    })
}