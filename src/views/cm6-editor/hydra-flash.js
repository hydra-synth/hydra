// import { evalAction, evalDecoration, evalEffect, evalTheme, evalLine, evalBlock } from "@management/cm-evaluate";
import {  flashAction, flashEffect, flashDecoration } from "./flash-code";

import { keymap } from "@codemirror/view"
// import obj from "@management/cm-evaluate";

export function flashAll({ state, dispatch }) {
    dispatch({ effects: flashEffect.of({ from : 0, to: state.doc.length, shouldUpdateURL: true}) });
    return true
}

function flashLine({ state, dispatch }) {
    const line = state.doc.lineAt(state.selection.main.from);
    dispatch({ effects: flashEffect.of(line) });
    return true
}

function flashBlock({ state, dispatch }) {
    let { doc, selection } = state;
    let { text, number } = state.doc.lineAt(selection.main.from);
  
    if (text.trim().length === 0) return true;
  
    let fromL, toL;
    fromL = toL = number;
  
    while (fromL > 1 && doc.line(fromL - 1).text.trim().length > 0) {
      fromL -= 1;
    }
    while (toL < doc.lines && doc.line(toL + 1).text.trim().length > 0) {
      toL += 1;
    }
  
    let { from } = doc.line(fromL);
    let { to } = doc.line(toL);
  
    dispatch({ effects: flashEffect.of({ from, to }) });
   
    return true
  }
  
   
const flashKeymap = [
//   { key: "Shift-Enter", run: evaluateSelection },
//   { key: "Mod-Enter", run: evaluateSelection },
    // 'Ctrl-/': 'editor:toggleComment',
    // 'Alt-Enter': 'editor:evalBlock',
    // 'Shift-Ctrl-Enter': 'editor:evalAll',
  { key: "Shift-Ctrl-Enter", run: flashAll },
  { key: "Ctrl-Enter", run: flashLine },
  { key: "Alt-Enter", run: flashBlock },
];

export * from "./flash-code/flashTheme"
export * from "./flash-code/flash";
export * from './flash-code'

// console.log('DEFAULT EXPORT', obj)
export function flashCode(action) {
    return [
        flashAction(action),
        flashDecoration(),
        // evalDecoration(),
        // evalTheme,
        keymap.of(flashKeymap),
    ]
}