// import { evalAction, evalDecoration, evalEffect, evalTheme, evalLine, evalBlock } from "@management/cm-evaluate";
import {  flashAction as evalAction, flashEffect as evalEffect, getLine as evalLine, getBlock as evalBlock } from "./flash-code";

import { keymap } from "@codemirror/view"
// import obj from "@management/cm-evaluate";

function evalAll({ state, dispatch }) {
    // const { from, to } = state.doc.visibleRanges
     // console.log('RANGES', state.doc.visibleRanges, state.doc, state, view)
    dispatch({ effects: evalEffect.of({ from : 0, to: state.doc.length}) });
    // return state.doc.toString()
    return true
}
   
const hydraKeymap = [
//   { key: "Shift-Enter", run: evaluateSelection },
//   { key: "Mod-Enter", run: evaluateSelection },
    // 'Ctrl-/': 'editor:toggleComment',
    // 'Alt-Enter': 'editor:evalBlock',
    // 'Shift-Ctrl-Enter': 'editor:evalAll',
  { key: "Shift-Ctrl-Enter", run: evalAll },
  { key: "Ctrl-Enter", run: evalLine },
  { key: "Alt-Enter", run: evalBlock },
];


// console.log('DEFAULT EXPORT', obj)
export function hydraEval(action) {
    return [
        evalAction(action),
        // evalDecoration(),
        // evalTheme,
        keymap.of(hydraKeymap),
    ]
}