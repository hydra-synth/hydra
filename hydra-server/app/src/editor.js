/* eslint-disable no-eval */
var CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/mode/javascript/javascript')
require('codemirror/addon/hint/javascript-hint')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/selection/mark-selection')
require('codemirror/addon/selection/active-line')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/edit/closebrackets')
require('codemirror/addon/comment/comment')

var Mutator = require('./Mutator.js');

var isShowing = true

var EditorClass = function () {
	console.log("*** Editor class created");
  var self = this

	var container = document.createElement('div')
  container.setAttribute('id','editor-container')
  var el = document.createElement('TEXTAREA')
  document.body.appendChild(container)
  container.appendChild(el)

  this.mutator = new Mutator(this);
  this.cm = CodeMirror.fromTextArea(el, {
    theme: 'tomorrow-night-eighties',
    value: 'hello',
    mode: {name: 'javascript', globalVars: true},
    lineWrapping: true,
    styleSelectedText: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    styleActiveLine: true,
    comment: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      'Shift-Alt-A': function(instance) {
        self.cm.toggleComment();
      },
    },
  })

  this.cm.refresh()

  this.show()
  // TO DO: add show code param
  let searchParams = new URLSearchParams(window.location.search)
  let showCode = searchParams.get('show-code')

    if(showCode == "false") {
      console.log("not showing code")
      var l = document.getElementsByClassName('CodeMirror-scroll')[0]
      l.style.display = 'none'
    //  self.logElement.style.display = 'none'
      isShowing = false
    }
  //}
}

EditorClass.prototype.clear = function () {
  this.cm.setValue('\n \n // Type some code on a new line (such as "osc().out()"), and press CTRL+shift+enter')
}

EditorClass.prototype.setValue = function (val) {
  this.cm.setValue(val)
}

EditorClass.prototype.getValue = function () {
  return this.cm.getValue()
}

EditorClass.prototype.hide = function () {
  var l = document.getElementsByClassName('CodeMirror-scroll')[0]
  var m = document.getElementById('modal-header')
  l.style.opacity = 0
//  this.logElement.style.opacity  = 0
  m.style.opacity = 0
  this.isShowing = false
}

EditorClass.prototype.show = function () {
  var l = document.getElementsByClassName('CodeMirror-scroll')[0]
  var m = document.getElementById('modal-header')
  l.style.opacity= 1
  m.style.opacity = 1
//  this.logElement.style.opacity  = 1
  this.isShowing = true
}

EditorClass.prototype.toggle = function () {
  if (this.isShowing) {
    this.hide()
  } else {
    this.show()
  }
}

EditorClass.prototype.getLine = function () {
  var c = this.cm.getCursor()
  var s = this.cm.getLine(c.line)
//  this.cm.markText({line: c.line, ch:0}, {line: c.line+1, ch:0}, {className: 'styled-background'})
  this.flashCode({line: c.line, ch:0}, {line: c.line+1, ch:0})
  return s
}

EditorClass.prototype.flashCode = function (start, end) {
    var marker = this.cm.markText(start, end, {className: 'styled-background'})
    setTimeout(() =>   marker.clear(), 300)
}


EditorClass.prototype.getCurrentBlock = function () { // thanks to graham wakefield + gibber
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



module.exports = EditorClass
