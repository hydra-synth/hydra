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
          isShowing = false
        } else {
          l.style.display = 'block'
          isShowing = true
        }
      },
      'Ctrl-Enter': function (instance) {
        var c = instance.getCursor()
        var s = instance.getLine(c.line)
        eval(s)
      },
      'Alt-Enter': (instance) => {
        var text = self.selectCurrentBlock(instance)
        console.log('text', text)
        eval(text.text)
      }
    }
  })
  var startString = 'o0.osc(' + 2 + Math.floor(Math.pow(10, Math.random() * 2)) + ')'
  startString += '.color([' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2) + ',' + Math.random().toFixed(2) + '])'
  startString += '.rotate(' + Math.random().toFixed(2) + ')'
  // 'o0.osc().rotate(0.1, 0.1).color()'
  this.cm.setValue(startString)
  this.cm.markText({line: 0, ch: 0}, {line: 6, ch: 42}, {className: 'styled-background'})
  this.cm.refresh()
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
}

EditorClass.prototype.eval = function (arg) {
  var jsString
  if (arg) {
    jsString = arg
  } else {
    jsString = this.cm.getValue()
  }
  try {
    eval(jsString)
  } catch (e) {
    console.log('ERROR', JSON.stringify(e))
  }
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
