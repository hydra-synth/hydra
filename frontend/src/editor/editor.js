/* eslint-disable no-eval */
var CodeMirror = require('codemirror-minified/lib/codemirror')
require('codemirror-minified/mode/javascript/javascript')
require('codemirror-minified/addon/hint/javascript-hint')
require('codemirror-minified/addon/hint/show-hint')
require('codemirror-minified/addon/selection/mark-selection')
require('codemirror-minified/addon/comment/comment')

const EventEmitter = require('events')

var Mutator = require('../randomizer/Mutator.js');


var isShowing = true

module.exports = class Editor {
  constructor() {
    console.log("*** Editor class created");
    var self = this

    var container = document.createElement('div')
    container.setAttribute('id', 'editor-container')
    var el = document.createElement('TEXTAREA')
    document.body.appendChild(container)
    container.appendChild(el)

    this.mutator = new Mutator(this);
    this.cm = CodeMirror.fromTextArea(el, {
      theme: 'tomorrow-night-eighties',
      value: 'hello',
      mode: { name: 'javascript', globalVars: true },
      lineWrapping: true,
      styleSelectedText: true
    })
    // console.log('code mirror', this.cm)
    //this.cm.removeKeyMap()

    this.cm.refresh()

    this.show()
    // // TO DO: add show code param
    let searchParams = new URLSearchParams(window.location.search)
    let showCode = searchParams.get('show-code')

    if (showCode === "false") {
      // console.log("not showing code")
      var l = document.getElementsByClassName('CodeMirror-scroll')[0]
      l.style.display = 'none'
      //  self.logElement.style.display = 'none'
      isShowing = false
    }
  }

  clear() {
    this.cm.setValue('\n \n // Type some code on a new line (such as "osc().out()"), and press CTRL+shift+enter')
  }

  setValue(val) {
    this.cm.setValue(val)
  }

  getValue() {
    return this.cm.getValue()
  }

  hide() {
    var l = document.getElementsByClassName('CodeMirror-scroll')[0]
    var m = document.getElementById('modal-header')
    //   l.style.opacity = 0
    // //  this.logElement.style.opacity  = 0
    //   m.style.opacity = 0
    l.style.display = 'none'
    m.style.display = 'none'
    this.isShowing = false
  }

  show() {
    var l = document.getElementsByClassName('CodeMirror-scroll')[0]
    var m = document.getElementById('modal-header')
    // l.style.opacity= 1
    // m.style.opacity = 1
    l.style.display = 'block'
    m.style.display = 'flex'
    //  this.logElement.style.opacity  = 1
    this.isShowing = true
  }

  toggle() {
    if (this.isShowing) {
      this.hide()
    } else {
      this.show()
    }
  }

  getLine() {
    var c = this.cm.getCursor()
    var s = this.cm.getLine(c.line)
    //  this.cm.markText({line: c.line, ch:0}, {line: c.line+1, ch:0}, {className: 'styled-background'})
    this.flashCode({ line: c.line, ch: 0 }, { line: c.line + 1, ch: 0 })
    return s
  }

  flashCode(start, end) {
    if (!start) start = { line: this.cm.firstLine(), ch: 0 }
    if (!end) end = { line: this.cm.lastLine() + 1, ch: 0 }
    var marker = this.cm.markText(start, end, { className: 'styled-background' })
    setTimeout(() => marker.clear(), 300)
  }


  getCurrentBlock() { // thanks to graham wakefield + gibber
    var editor = this.cm
    var pos = editor.getCursor()
    var startline = pos.line
    var endline = pos.line
    while (startline > 0 && editor.getLine(startline) !== '') {
      startline--
    }
    while (endline < editor.lineCount() && editor.getLine(endline) !== '') {
      endline++
    }
    var pos1 = {
      line: startline,
      ch: 0
    }
    var pos2 = {
      line: endline,
      ch: 0
    }
    var str = editor.getRange(pos1, pos2)

    this.flashCode(pos1, pos2)

    return {
      start: pos1,
      end: pos2,
      text: str
    }
  }

}

