import html from 'choo/html'
import raw from 'choo/html/raw'

const d = (eventName, e, emit) => () => emit(eventName, e)

const icon = (id, className, title, event) => html`
<i id="${id}-icon" class="fas ${className} extension-icon" title="${title}" onclick=${event} aria-hidden="true"></i>`
//      onclick="${() => emit('extensions: select extension', index)}" 

const detailedInfo = (ext, index, emit) => {
  return html`<div 
     class="extension-list-item selected" style="display:flex;justify-content:space-between">
     <div >
     <div><span style="font-weight:900">${ext.name} - </span> <span style="text-overflow:ellipses;overflow:hidden"> ${ext.author} </span></div>
     <div> <span style="">${ext.description}</span></div>
     </div>
     <div class="extension-buttons">
     <div> 
      ${icon('add-extension', 'fa-solid fa-plus', 'add to editor', d('extensions: add to editor', index, emit))}
      ${icon('show-documentation', "fa-book-open", 'show documentation', () => {  window.open(ext.documentation, '_blank') })}
      </div>
      <div style="font-size: 0.8rem;/*font-family: monospace*/">
        ${ext.examples.map((path, i) => html`<div class="extension-icon example-icon" onclick=${() => { emit('extensions: load example', index, i)}}>${i+1}</div>`)}
      </div>
     </div>`
 }
const listInfo = (ext, index, emit) => html`<div onclick="${() => emit('extensions: select extension', index)}" class="extension-list-item"><span style="font-weight:900">${ext.name} - </span> <span style="text-overflow:ellipses;overflow:hidden"> ${ext.description} </span> <span style="float:right">${ext.author}</span></div>`

export default (state, emit) => {
  const { categories, selectedCategoryIndex,  extensions, selectedExtension} = state.extensions
  const { t } = state.translation
//  ${i=== selectedExtension? detailedInfo(ext, i, emit) : listInfo(ext, i, emit)}
  const content = html`<div class="modal-content extensions">
${raw(t('extensions.about'))}
<div class="extension-list">
${extensions.map((ext, i) => detailedInfo(ext, i, emit))}
</div>
</div>
`
  const header = html`<div style="display:flex;flex-wrap:wrap">
  ${categories.map((ex, i) => html`<div 
    class="language-select ${i===selectedCategoryIndex ? 'selected' : ''}" 
    onclick=${() => emit('extensions: select category', i)}
    >${ex}</div>`)}
  </div>`

  return { content, header }
}