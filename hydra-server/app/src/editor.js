/* eslint-disable no-eval */
var CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/mode/javascript/javascript')
require('codemirror/addon/hint/javascript-hint')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/selection/mark-selection')

var isShowing = true

var EditorClass = function () {
  var self = this

  var container = document.createElement('div')
  container.setAttribute('id','editor-container')
  var el = document.createElement('TEXTAREA')
  document.body.appendChild(container)
  container.appendChild(el)

  this.cm = CodeMirror.fromTextArea(el, {
    theme: 'tomorrow-night-eighties',
    value: 'hello',
    mode: {name: 'javascript', globalVars: true},
    lineWrapping: true,
    styleSelectedText: true,
    // extraKeys: {
    //   'Shift-Ctrl-Enter': function (instance) {
    //       self.evalAll((code, error) => {
    //         console.log('evaluated', code, error)
    //         // if(!error){
    //         //   self.saveSketch(code)
    //         // }
    //       })
    //   },
    //   'Shift-Ctrl-G': function (instance) {
    //     self.shareSketch()
    //   },
    //   'Shift-Ctrl-H': function (instance) {
    //     self.toggle()
    //   },
    //   'Ctrl-Enter': function (instance) {
    //     // var c = instance.getCursor()
    //     // var s = instance.getLine(c.line)
    //     // self.eval(s)
    //     console.log('LINE', self.getLine())
    //   },
    //   'Shift-Ctrl-W': function (instance) {
    //
    //   },
    //   'Shift-Ctrl-S': function (instance) {
    //     screencap()
    //   },
    //   'Alt-Enter': (instance) => {
    //     var text = self.selectCurrentBlock(instance)
    //     console.log('text', text)
    //     self.eval(text.text)
    //   }
    // }
  })

  console.log('EDITOR', this.cm)
  this.cm.markText({line: 0, ch: 0}, {line: 6, ch: 42}, {className: 'styled-background'})
  this.cm.refresh()
  // this.logElement = document.createElement('div')
  // this.logElement.className = "console cm-s-tomorrow-night-eighties"
  // document.body.appendChild(this.logElement)
  // this.log("hi")

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
// EditorClass.prototype.saveExample = function(code) {
//   console.log('no function for save example has been implemented')
// }

// EditorClass.prototype.evalAll = function (callback) {
//   this.eval(this.cm.getValue(), function (code, error){
//     if(callback) callback(code, error)
//   })
// }

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
  return s
}

// EditorClass.prototype.eval = function (arg, callback) {
//   var self = this
//   var jsString = arg
//   var isError = false
//   try {
//     eval(jsString)
//     self.log(jsString)
//   } catch (e) {
//     isError = true
//   //  console.log("logging", e.message)
//     self.log(e.message, "log-error")
//     //console.log('ERROR', JSON.stringify(e))
//   }
// //  console.log('callback is', callback)
//   if(callback) callback(jsString, isError)
//
// }
//
// EditorClass.prototype.log = function(msg, className = "") {
//   this.logElement.innerHTML =` >> <span class=${className}> ${msg} </span> `
// }

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
  return {
    start: pos1,
    end: pos2,
    text: str
  }
}

module.exports = EditorClass
