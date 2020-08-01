/* eslint-disable no-eval */
var CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/mode/javascript/javascript')
require('codemirror/addon/hint/javascript-hint')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/selection/mark-selection')
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
    styleSelectedText: true
  })

  console.log('code mirror', this.cm)
	//this.cm.removeKeyMap()

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
//   l.style.opacity = 0
// //  this.logElement.style.opacity  = 0
//   m.style.opacity = 0
l.style.display = 'none'
m.style.display = 'none'
  this.isShowing = false
}

EditorClass.prototype.show = function () {
  var l = document.getElementsByClassName('CodeMirror-scroll')[0]
  var m = document.getElementById('modal-header')
  // l.style.opacity= 1
  // m.style.opacity = 1
	l.style.display = 'block'
	m.style.display = 'flex'
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
	  if(!start) start = {line: this.cm.firstLine(), ch:0}
		if(!end) end = {line: this.cm.lastLine() + 1, ch:0}
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


EditorClass.prototype.autoComplete = function () {
  var editor = this.cm
  var pos = editor.getCursor()
  var startline = pos.line

  var found = true;
  var pos1 = {
    line: startline,
    ch: pos.ch - 2
  }
  var pos2 = {
    line: startline,
    ch: pos.ch
  }
  // 2 chars
  var str = editor.getRange(pos1, pos2)
  console.log(str);
  switch (str) {
    case 'mx':
      editor.replaceRange('modulateRepeatX(osc(10), reps = 5.0, offset = () => Math.sin(time) * 5)', pos1, pos2)
      pos1.ch += 16;
      pos2.ch += 17;
      editor.setSelection(pos1, pos2)
      break;
    case 'my':
      editor.replaceRange('modulateRepeatY(osc(10), reps = 5.0, offset = () => Math.sin(time) * 5)', pos1, pos2)
      pos1.ch += 16;
      pos2.ch += 17;
      editor.setSelection(pos1, pos2)
      break;
    case 'mr':
      editor.replaceRange('modulateRotate(noise(10), multiple = 1.0, offset = 1.0)', pos1, pos2)
      pos1.ch += 15;
      pos2.ch += 18;
      editor.setSelection(pos1, pos2)
      break;
    case 'mk':
      editor.replaceRange('modulateKaleid(o0, sides = 5.0)', pos1, pos2)
      pos1.ch += 15;
      pos2.ch += 15;
      editor.setSelection(pos1, pos2)
      break;
    case 'ms':
      editor.replaceRange('modulateScale(osc(10), multiple = 1.0, offset = 1.0)', pos1, pos2)
      pos1.ch += 14;
      pos2.ch += 15;
      editor.setSelection(pos1, pos2)
      break;
    case 'mp':
      editor.replaceRange('modulatePixelate(osc(10), multiple = 1.0, offset = 1.0)', pos1, pos2)
      pos1.ch += 17;
      pos2.ch += 19;
      editor.setSelection(pos1, pos2)
      break;
    case 'sa':
      editor.replaceRange('saturate(0.1)', pos1, pos2)
      pos1.ch += 9;
      pos2.ch += 10;
      editor.setSelection(pos1, pos2)
      break;
    case 'la':
      editor.replaceRange('layer(shape(7))', pos1, pos2)
      pos1.ch += 9;
      pos2.ch += 10;
      editor.setSelection(pos1, pos2)
      break;
    case 'ch':
      editor.replaceRange('chromatic(o0, offsetX = 0.1, offsetY = 0.1)', pos1, pos2)
      pos1.ch += 10;
      pos2.ch += 11;
      editor.setSelection(pos1, pos2)
      break;
    case 'sx':
      editor.replaceRange('modulateScrollX(o0, scrollX = 0.1, speed = 0.01)', pos1, pos2)
      pos1.ch += 16;
      pos2.ch += 16;
      editor.setSelection(pos1, pos2)
      break;
    case 'sy':
      editor.replaceRange('modulateScrollY(o0, scrollY = 0.1, speed = 0.01)', pos1, pos2)
      pos1.ch += 16;
      pos2.ch += 16;
      editor.setSelection(pos1, pos2)
      break;
    default:
      found = false;
      break;
  } // 2 char switch end
  // 1 char
  if (!found) {
    pos1 = {
      line: pos.line,
      ch: pos.ch - 1
    }
    found = true;
    var str = editor.getRange(pos1, pos2)
    switch (str) {
      // frag vars
      case '2':
        editor.replaceRange('vec2 vv = vec2(0.0, 0.0);', pos1, pos2)
        pos1.ch += 5;
        pos2.ch += 6;
        editor.setSelection(pos1, pos2)
        break;
      case '3':
        editor.replaceRange('vec3 vvv = vec3(0.0, 0.0, 0.0);', pos1, pos2)
        pos1.ch += 5;
        pos2.ch += 7;
        editor.setSelection(pos1, pos2)
        break;
      case '4':
        editor.replaceRange('vec4 vvvv = vec4(0.0, 0.0, 0.0, 0.0);', pos1, pos2)
        pos1.ch += 5;
        pos2.ch += 8;
        editor.setSelection(pos1, pos2)
        break;
      case '1':
        editor.replaceRange('float f = 0.0;', pos1, pos2)
        pos1.ch += 6;
        pos2.ch += 6;
        editor.setSelection(pos1, pos2)
        break;
      case '{':
        editor.replaceRange(`{;}`, pos1, pos2)
        break;
      case '(':
        editor.replaceRange(`()`, pos1, pos2)
        break;
      case '[':
        editor.replaceRange(`[]`, pos1, pos2)
        break;
      // frag functions
      case 'f':
        editor.replaceRange(`float fcf(in vec3 pos) {float f = 0.0;return f;}`, pos1, pos2)
        pos1.ch += 6;
        pos2.ch += 8;
        editor.setSelection(pos1, pos2)
        break;
      case 'g':
        editor.replaceRange(`vec2 fc2(in vec3 pos) {vec2 vv = vec2(0.0, 0.0);return vv;}`, pos1, pos2)
        pos1.ch += 5;
        pos2.ch += 7;
        editor.setSelection(pos1, pos2)
        break;
      case 'h':
        editor.replaceRange(`vec3 fc3(in vec3 pos) {vec3 vvv = vec3(0.0, 0.0, 0.0);return vvv;}`, pos1, pos2)
        pos1.ch += 5;
        pos2.ch += 7;
        editor.setSelection(pos1, pos2)
        break;
      case 'j':
        editor.replaceRange(`vec4 fc4(in vec3 pos) {vec4 vvvv = vec4(0.0, 0.0, 0.0, 0.0);return vvvv;}`, pos1, pos2)
        pos1.ch += 5;
        pos2.ch += 7;
        editor.setSelection(pos1, pos2)
        break;
      // hydra functions
      case 't':
        editor.replaceRange(`() => Math.sin(time) * 1.0`, pos1, pos2)
        pos1.ch += 23;
        pos2.ch += 23;
        editor.setSelection(pos1, pos2)
        break;
      case 'a':
        editor.replaceRange(`() => a.fft[1] * 1.0`, pos1, pos2)
        pos1.ch += 12;
        pos2.ch += 12;
        editor.setSelection(pos1, pos2)
        break;
      case 'm':
        editor.replaceRange(`() => cc[11] * 1.0`, pos1, pos2)
        pos1.ch += 10;
        pos2.ch += 10;
        editor.setSelection(pos1, pos2)
        break;
      // for
      case 'r':
        editor.replaceRange('for (int i=0; i<2 ;i++) { }', pos1, pos2)
        pos1.ch += 25;
        pos2.ch += 25;
        editor.setSelection(pos1, pos2)
        break;
      case 's':
        editor.replaceRange('Math.sin(time)', pos1, pos2)
        pos1.ch += 4;
        pos2.ch += 7;
        editor.setSelection(pos1, pos2)
        break;
      case 'c':
        editor.replaceRange('Math.cos(time)', pos1, pos2)
        pos1.ch += 4;
        pos2.ch += 7;
        editor.setSelection(pos1, pos2)
        break;
      // if   
      case '=':
        editor.replaceRange('if (i==0.0) { } else { }', pos1, pos2)
        pos1.ch += 13;
        pos2.ch += 13;
        editor.setSelection(pos1, pos2)
        break;
      case '>':
        editor.replaceRange('if (i>0.0) { } else { }', pos1, pos2)
        pos1.ch += 12;
        pos2.ch += 12;
        editor.setSelection(pos1, pos2)
        break;
      case '<':
        editor.replaceRange('if (i<0.0) { } else { }', pos1, pos2)
        pos1.ch += 12;
        pos2.ch += 12;
        editor.setSelection(pos1, pos2)
        break;
      case '#':
        editor.replaceRange(`#if V==1
          #else
          #endif`, pos1, pos2)
        pos1.ch += 4;
        pos2.ch += 4;
        editor.setSelection(pos1, pos2)
        break;

      default:
        found = false;
        break;
    }
  }
}
module.exports = EditorClass
