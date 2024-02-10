// import extensions from './÷extensions/hydra-extensions.json'

// const CATEGORIES = ['extensions', 'external libraries', 'examples']
const BASE_URL = "https://raw.githubusercontent.com/hydra-synth/hydra-extensions/main/"

export default async function store(state, emitter) {
    // old / deprecated
    // state.extensions = {
    //     categories: ['extensions', 'external libraries', 'examples'],
    //     selectedCategoryIndex: 0,
    //     //extensions: extensions,
    //     extensions: [],
    //     selectedExtension: null,
    //     baseURL: '/extensions/'
    // }

    // new
    state.extensions = {
        baseURL: BASE_URL,
        selectedCategoryIndex: 0,
        categories: [
            {
                name: 'extensions',
                slug: 'extensions',
                entries: [],
                hasLoaded: false
            },
            {
                name: 'external libraries',
                slug: 'external-libraries',
                entries: [],
                hasLoaded: false
            },
            {
                name: 'examples',
                slug: 'examples',
                entries: [],
                hasLoaded: false
            }
        ]
    }



    // const config = await import('./extensions/config.json', {
    //     assert: {
    //         type: 'json'
    //     }
    // });
    // fetch(CONFIG_PATH)
    // .then((response => response.json())).then( d => {
    //         console.log('loaded d', d)
    //     })

    // config.then( d => {
    //     console.log('loaded d', d)
    // })
    

    // state.extensions.extensions.forEach((ext) => { ext.thumbnail = state.extensions.baseURL + ext.thumbnail })

    emitter.on('extensions: select category', (index = state.extensions.selectedCategoryIndex) => {
        state.extensions.selectedCategoryIndex = index
        emitter.emit('render')
        const currCategory = state.extensions.categories[index]
        if(!currCategory.hasLoaded) {
            const extensionPath = state.extensions.baseURL + currCategory.slug + '.json'+'?laskd'

            fetch(extensionPath)
    .then((response => response.json())).then( d => {
            console.log('loaded d', d)
            d.forEach((ext) => { ext.thumbnail = state.extensions.baseURL +  'thumbnails/' + ext.thumbnail })
            currCategory.entries = d
            emitter.emit('render')
        })
        }
    })

    emitter.on('extensions: add to editor', (extensionIndex) => {
        const {categories, selectedCategoryIndex } = state.extensions
        const code = categories[selectedCategoryIndex].entries[extensionIndex].load
        emitter.emit('editor: add code to top', code)
    })

    // emitter.on('extensions: select extension', (index) => {
    //     // if(index === state.extensions.selectedExtension) {

    //     // }
    //     state.extensions.selectedExtension = index
    //     emitter.emit('render')
    // })

    emitter.on('extensions: load example', (extensionIndex, exampleIndex) => {
        const {categories, selectedCategoryIndex } = state.extensions
        const path = categories[selectedCategoryIndex].entries[extensionIndex].examples[exampleIndex]
        const newURL= new URL(path);
        console.log(newURL, state.gallery)

        state.gallery.setSketchFromURL(newURL.search, (code) => {
            emitter.emit('load and eval code', code)
        })
    })
}