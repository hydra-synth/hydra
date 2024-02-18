/* eslint-disable no-eval */
import { EditorView } from "codemirror"
import { placeholder, keymap } from "@codemirror/view"
import { hydraSetup } from "./editor-setup.js"
import { javascript } from "@codemirror/lang-javascript"
import { flashCode, flashAll, flashTheme } from "./hydra-flash.js";
import hydraKeymaps from "./hydra-keymaps.js"

import EventEmitter from 'nanobus'
import beautify from 'js-beautify'


export default class Editor extends EventEmitter {
  constructor(parent, emit) {
    super()
    console.log("*** Editor class created");
    var self = this

    this.cm = new EditorView({
      lineWrapping: true,
      extensions: [
        keymap.of(hydraKeymaps(emit)),
        hydraSetup,
        javascript(),
        placeholder('//\n// Type some code on a new line (such as "osc().out()"), and press CTRL+shift+enter'),
        flashCode((code, shouldUpdateURL = false) => {
          emit('repl: eval', code)
          if (shouldUpdateURL) emit('gallery: save to URL', code)
        }),
        flashTheme,
      ],
      parent: parent,

    })
    // window.cm = this.cm
    // window.editor = this
  }

  clear() {
    this.setValue('')
  }

  flashCode() {
    flashAll(this.cm)
    //this.cm.dispatch({ effects: flashEffect.of({ from : 0, to: this.cm.state.doc.length, shouldUpdateURL: true}) });
  }

  setValue(val) {
    this.cm.dispatch({
      changes: { from: 0, to: this.cm.state.doc.length, insert: val }
    })
  }

  getValue() {
    this.cm.state.doc.toString()
  }

  formatCode() {
    const formatted = beautify(this.cm.state.doc.toString()
      , { indent_size: 2, "break_chained_methods": true /*"indent_with_tabs": true*/ })
    // this.cm.setValue(formatted)

    this.cm.dispatch({
      changes: { from: 0, to: this.cm.state.doc.length, insert: formatted }
    })
  }

  addCodeToTop(code = '') {
    this.cm.dispatch({
      changes: {from: 0, insert: `${code}\n\n`}
    })
    
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


}

