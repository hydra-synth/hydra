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
        self.eval()
      },
      'Shift-Ctrl-H': function (instance) {
        var l = document.getElementsByClassName('CodeMirror-scroll')[0]
        if (isShowing) {
          l.style.display = 'none'
          self.logElement.style.display = 'none'
          isShowing = false
        } else {
          l.style.display = 'block'
          self.logElement.style.display = 'block'
          isShowing = true
        }
      },
      'Ctrl-Enter': function (instance) {
        var c = instance.getCursor()
        var s = instance.getLine(c.line)
        self.eval(s)
      },
      'Alt-Enter': (instance) => {
        var text = self.selectCurrentBlock(instance)
        console.log('text', text)
        self.eval(text.text)
      }
    }
  })

  // if there are url paramters, convert to code
  let searchParams = new URLSearchParams(window.location.search)
  let base64Code = searchParams.get('id')

  if (base64Code) {
      let decoded = decodeURIComponent(atob(base64Code))
      this.cm.setValue(decoded)
  } else {
    var startString = 'osc(' + 2 + Math.floor(Math.pow(10, Math.random() * 2)) + ')'
    startString += '.color(' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2)+ ')'
    startString += '.rotate(' + Math.random().toFixed(2) + ')'
    startString += '.out(o0)'
    // 'o0.osc().rotate(0.1, 0.1).color()'
    this.cm.setValue(startString)
  }
  this.cm.markText({line: 0, ch: 0}, {line: 6, ch: 42}, {className: 'styled-background'})
  this.cm.refresh()
  this.logElement = document.createElement('div')
  this.logElement.className = "console cm-s-tomorrow-night-eighties"
  document.body.appendChild(this.logElement)
  this.log("hi")
  //   var arrows = [37, 38, 39, 40]
  //   var self = this
  // //   this.cm.on('keyup', function(cm, e) {
  // //   if (arrows.indexOf(e.keyCode) < 0) {
  // //     self.cm.execCommand('autocomplete')
  // //   }
  // // })
  // console.log('code mirror', myCodeMirror)
  //   (document.body, {
  //   value: 'function myScript(){return 100;}\n',
  //   mode:  'javascript'
  // });
  //  editor.refresh()
  let showCode = searchParams.get('show-code')
  console.log(showCode)
//  if(showCode !== null) {
    console.log("about to ")
    if(showCode == "false") {
      console.log("not showing code")
        var l = document.getElementsByClassName('CodeMirror-scroll')[0]
      l.style.display = 'none'
      self.logElement.style.display = 'none'
      isShowing = false
    }
  //}
}

EditorClass.prototype.eval = function (arg) {
  var self = this
  var jsString
  var isError = false
  if (arg) {
    jsString = arg
  } else {
    jsString = this.cm.getValue()
  }
  try {
    eval(jsString)
  } catch (e) {
    isError = true
    console.log("logging", e.message)
    self.log(e.message, "log-error")
    //console.log('ERROR', JSON.stringify(e))
  }
  if(!isError){
    // if successfully evaluated, update url
    // based on: https://github.com/htor/scratch-editor/blob/master/scripts/tools.js
    if(!arg){
      let base64 = btoa(encodeURIComponent(jsString))
      console.log(base64)
      let newurl = window.location.protocol + '//' +
      window.location.host + window.location.pathname + `?id=${base64}`
      window.history.pushState({ path: newurl }, '', newurl)
      self.log(jsString)
    }
  }
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
// function getCompletions(token, context) {
//   console.log('getting completiongs', token)
//   var found = [], start = token.string;
//   function maybeAdd(str) {
//     if (str.indexOf(start) == 0) found.push(str);
//   }
//   function gatherCompletions(obj) {
//     if (typeof obj == 'string') forEach(stringProps, maybeAdd);
//     else if (obj instanceof Array) forEach(arrayProps, maybeAdd);
//     else if (obj instanceof Function) forEach(funcProps, maybeAdd);
//     for (var name in obj) maybeAdd(name);
//   }
//
//   if (context) {
//     // If this is a property, see if it belongs to some object we can
//     // find in the current environment.
//     var obj = context.pop(), base;
//     if (obj.className == 'js-variable')
//       base = window[obj.string];
//     else if (obj.className == 'js-string')
//       base = '';
//     else if (obj.className == 'js-atom')
//       base = 1;
//     while (base != null && context.length)
//       base = base[context.pop().string];
//     if (base != null) gatherCompletions(base);
//   }
//   else {
//     // If not, just look in the window object and any local scope
//     // (reading into JS mode internals to get at the local variables)
//     for (var v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
//     gatherCompletions(window);
//     forEach(keywords, maybeAdd);
//   }
//   return found;
// }
module.exports = EditorClass
