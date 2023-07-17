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

    emitter.on('extensions: select extension', (index) => {
        // if(index === state.extensions.selectedExtension) {

        // }
        state.extensions.selectedExtension = index
        emitter.emit('render')
    })
}