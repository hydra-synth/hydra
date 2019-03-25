/* eslint-disable no-eval */
var CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/mode/javascript/javascript')
require('codemirror/addon/hint/javascript-hint')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/selection/mark-selection')

var isShowing = true

var EditorClass = function () {
  var self = this

  this.cm = CodeMirror.fromTextArea(document.getElementById('code'), {
    theme: 'tomorrow-night-eighties',
    value: 'hello',
    mode: {name: 'javascript', globalVars: true},
    lineWrapping: true,
    styleSelectedText: true,
    extraKeys: {
      'Shift-Ctrl-Enter': function (instance) {
          self.evalAll((code, error) => {
            console.log('evaluated', code, error)
            // if(!error){
            //   self.saveSketch(code)
            // }
          })
      },
      'Shift-Ctrl-G': function (instance) {
        self.shareSketch()
      },
      'Shift-Ctrl-H': function (instance) {
        var l = document.getElementsByClassName('CodeMirror-scroll')[0]
        var m = document.getElementById('modal-header')
        if (isShowing) {
          l.style.opacity = 0
          self.logElement.style.opacity  = 0
          m.style.opacity = 0
          isShowing = false
        } else {
          l.style.opacity= 1
          m.style.opacity = 1
          self.logElement.style.opacity  = 1
          isShowing = true
        }
      },
      'Ctrl-Enter': function (instance) {
        var c = instance.getCursor()
        var s = instance.getLine(c.line)
        self.eval(s)
      },
      'Shift-Ctrl-S': function (instance) {
        screencap()
      },
      'Alt-Enter': (instance) => {
        var text = self.selectCurrentBlock(instance)
        console.log('text', text)
        self.eval(text.text)
      }
    }
  })

  this.cm.markText({line: 0, ch: 0}, {line: 6, ch: 42}, {className: 'styled-background'})
  this.cm.refresh()
  this.logElement = document.createElement('div')
  this.logElement.className = "console cm-s-tomorrow-night-eighties"
  document.body.appendChild(this.logElement)
  this.log("hi")


  // TO DO: add show code param
  let searchParams = new URLSearchParams(window.location.search)
  let showCode = searchParams.get('show-code')

    if(showCode == "false") {
      console.log("not showing code")
      var l = document.getElementsByClassName('CodeMirror-scroll')[0]
      l.style.display = 'none'
      self.logElement.style.display = 'none'
      isShowing = false
    }
  //}
}

EditorClass.prototype.clear = function () {
  this.cm.setValue('\n \n // Type some code on a new line (such as "osc().out()"), and press CTRL+shift+enter')
}

EditorClass.prototype.saveSketch = function(code) {
  console.log('no function for save sketch has been implemented')
}

EditorClass.prototype.shareSketch = function(code) {
  console.log('no function for share sketch has been implemented')
}

// EditorClass.prototype.saveExample = function(code) {
//   console.log('no function for save example has been implemented')
// }

EditorClass.prototype.evalAll = function (callback) {
  this.eval(this.cm.getValue(), function (code, error){
    if(callback) callback(code, error)
  })
}

EditorClass.prototype.eval = function (arg, callback) {
  var self = this
  var jsString = arg
  var isError = false
  try {
    eval(jsString)
    self.log(jsString)
  } catch (e) {
    isError = true
  //  console.log("logging", e.message)
    self.log(e.message, "log-error")
    //console.log('ERROR', JSON.stringify(e))
  }
//  console.log('callback is', callback)
  if(callback) callback(jsString, isError)

}

EditorClass.prototype.log = function(msg, className = "") {
  this.logElement.innerHTML =` >> <span class=${className}> ${msg} </span> `
}

EditorClass.prototype.selectCurrentBlock = function (editor) { // thanks to graham wakefield + gibber
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
