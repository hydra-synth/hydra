import html from 'choo/html'

export default (state, emit) => {
  const content = html`
extensionssss
</div>
`
  const header = html`<div style="display:flex;flex-wrap:wrap">
  ${state.extensions.categories.map((ex) => html`<div class="language-select">${ex}</div>`)}
  </div>`

  return { content, header }
}