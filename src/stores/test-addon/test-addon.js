import html from 'choo/html'
import Component from 'choo/component'


export default class TestAddon extends Component {
  constructor(id, state, emit) {
    super(id)
    this.state = state
    this.emit = emit
  }

  load(element) {
  }

  update() {
    return false
  }

  createElement() {
   return html`
<div style="z-index: 100;position: absolute; top: 0; background-color: black">
<h1 style="">hola</h1>
<input oninput=${(e)=>window.vv=Number(e.target.value)} type="range" id="volume" name="volume" min="0" max="11" />
<button onclick=${(e)=>window.cm.dispatch({changes:{from:0,insert:"//haha"}})}>oi</button>
<button onclick=${(e)=>{ if(window.pushed){
  e.target.innerText="push"
  window.cm.dispatch({changes:{from:0,insert:"//haha"}})
}else{
  e.target.innerText="pop"
}
window.pushed=!window.pushed}}>push</button>
</div>`
  }
}
