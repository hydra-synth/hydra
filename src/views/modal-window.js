import html from 'choo/html'
import toolbar from './toolbar.js'

export default ({ content, header }, state, emit) => {
  const { t, languages } = state.translation
  const textDirection = state.translation.selectedLanguage === 'ar' && state.showInfo === true ? 'rtl' : 'ltr'

  return html`
<div id="info-container" class="${state.showInfo ? "" : "hidden"}" style="direction:${textDirection}">
  <div id="modal">
    <div id="modal-header" style="opacity:${state.showUI === true ? 1 : 0}">
     ${header}
      ${toolbar(state, emit)}
    </div>
    <div id="modal-body">
     ${content}
    </div>
  </div>
</div>
`
}