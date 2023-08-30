import html from 'choo/html'

export default function toolbar(state, emit) {
    const hidden = state.showInfo ? 'hidden' : ''

    const { t } = state.translation

    const dispatch = (eventName) => (e) => emit(eventName, e)

    const icon = (id, className, title, event) => html`
        <i id="${id}-icon" class="fas icon ${className}" title="${title}" onclick=${dispatch(event)} aria-hidden="true"></i>`

    

    const toggleInfo = state.showInfo ? icon("close", "fa-times", t('toolbar.hide-info'), 'ui: toggle info') : icon("close", "fa-question-circle", t('toolbar.show-info'), 'ui: toggle info') 
    
    const toggleExtensions = !state.showExtensions ? icon("add", "fa-solid fa-puzzle-piece", t('toolbar.load-extension'), 'ui: show extensions') : icon("close", "fa-question-circle", t('toolbar.show-info'), 'ui: hide extensions')  

    return html`<div id="toolbar-container">
        ${icon("run", `fa-play-circle ${hidden}`, t('toolbar.run'), 'editor: eval all')}
        ${icon("clear", `fa fa-trash ${hidden}`, t('toolbar.clear'), 'clear all')}
        ${toggleExtensions}
        ${icon("shuffle", `fa-random`, t('toolbar.shuffle'), 'gallery:showExample')}
        ${icon("mutator", `fa-dice ${hidden}`, t('toolbar.random'), 'editor: randomize')}
        ${state.serverURL === null ? '' : icon("share", `fa-upload ${hidden}`, t('toolbar.upload'), 'gallery:shareSketch')}
        ${toggleInfo}
    </div>`

    //        ${icon("share", `fa-upload ${hidden}`, t('toolbar.upload'), 'gallery:shareSketch')}

}