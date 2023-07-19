/* eslint-disable no-eval */
import {EditorView, basicSetup} from "codemirror"
import { placeholder, keymap } from "@codemirror/view"
import { hydraSetup } from "./editor-setup.js"
import {javascript} from "@codemirror/lang-javascript"
import EventEmitter from 'nanobus'
import { hydraEval as evaluation } from "./hydra-eval.js";

export default class Editor {
  constructor(parent, emit) {
    // super()
    console.log("*** Editor class created");
    var self = this
    this.cm = new EditorView({
      lineWrapping: true,
        extensions: [
          hydraSetup, 
          javascript(), 
          placeholder('//'),
          evaluation((code) => { 
            console.log('EVALUATED')
            emit('repl: eval', code)
            // @todo !! need access to current vie in order to pass info to linter
          //   view.dispatch({
          //     effects: evalLinter.reconfigure(linter(jsLinter()))
          // })
          }),
        ],
        parent: parent,
      
      })
    console.warn('loading editor')
  }

  clear() {
  }

  setValue(val) {
    console.log('SETTING VALUE')
    this.cm.dispatch({
      changes: { from: 0, to: this.cm.state.doc.length, insert: val }
    })
  }

  getValue() {
    this.cm.state.doc.toString()
  }

  formatCode() {
    const formatted = js_beautify(this.cm.state.doc.toString()
      , { indent_size: 2, "break_chained_methods": true /*"indent_with_tabs": true*/ })
    // this.cm.setValue(formatted)

    this.cm.dispatch({
      changes: { from: 0, to: this.cm.state.doc.length, insert: formatted }
    })
  }

  addCodeToTop(code = '') {
  
  }

  // hide() {
  //   console.log('hiding')
  //   var l = document.getElementsByClassName('CodeMirror')[0]
  //   var m = document.getElementById('modal-header')
  //   l.style.opacity = 0
  //   m.style.opacity = 0
  //   this.isShowing = false
  // }

  // show() {
  //   var l = document.getElementsByClassName('CodeMirror')[0]
  //   var m = document.getElementById('modal-header')
  //   l.style.opacity= 1
  //   m.style.opacity = 1
  //   l.style.pointerEvents = 'all'
  //   this.isShowing = true
  // }

  toggle() {
   
  }

  getLine() {
   
  }

  flashCode(start, end) {
   
  }


  getCurrentBlock() { // thanks to graham wakefield + gibber
   
  }

}

