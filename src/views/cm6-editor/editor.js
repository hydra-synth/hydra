/* eslint-disable no-eval */
import {EditorView, basicSetup} from "codemirror"
import { placeholder, keymap } from "@codemirror/view"
import { hydraSetup } from "./editor-setup.js"
import {javascript} from "@codemirror/lang-javascript"
import EventEmitter from 'nanobus'
import { hydraEval as evaluation } from "./hydra-eval.js";

export default class Editor extends EventEmitter {
  constructor(parent, emit) {
    super()
    console.log("*** Editor class created");
    var self = this
    let view = new EditorView({
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
  }

  getValue() {
  }

  formatCode() {
    
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

