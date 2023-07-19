// import { EditorView, KeyBinding } from "@codemirror/view";

import { flashEffect, flashAction } from "./flash";
// import { sendOSC } from "../../client/osc";
// from https://github.com/mindofmatthew/text.management/blob/main/app/codemirror/evaluate/commands.ts

export function getSelection({ state, dispatch }) {
  if (state.selection.main.empty) return false;
  dispatch({ effects: flashEffect.of(state.selection.main) });
  //return true;
  let { from, to } = state.selection.main;
  let text = state.doc.sliceString(from, to);
  return text
//  return sendOSC("/tidal/code", text);
}

export function getLine({ state, dispatch }) {
  const line = state.doc.lineAt(state.selection.main.from);
  dispatch({ effects: flashEffect.of(line) });
  //return true;

  //TODO: Move this away
  let { from, to } = line;
  let text = state.doc.sliceString(from, to);
  console.log('running get line')
  return text
  //return sendOSC("/tidal/code", text);
}

export function getAll({ state, view, dispatch }, showHighlight = true) {
 // const { from, to } = state.doc.visibleRanges
  // console.log('RANGES', state.doc.visibleRanges, state.doc, state, view)
 if(showHighlight) dispatch({ effects: flashEffect.of({ from : 0, to: state.doc.length}) });
  return state.doc.toString()
}

export function getBlock({ state, dispatch }) {
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

  // console.log('DISPATCHING FLASH EFFECT')
  dispatch({ effects: flashEffect.of({ from, to }) });
  // dispatch({ effects: flashAction(flashEffect.of({ from, to })) });
  //return true;

  //TODO: Move this away
  text = state.doc.sliceString(from, to);
  //return sendOSC("/tidal/code", text);
  return text
}

// export const evalKeymap = [
//   { key: "Shift-Enter", run: evaluateSelection },
//   { key: "Mod-Enter", run: evaluateSelection },
//   { key: "Shift-Enter", run: evaluateLine },
//   { key: "Ctrl-Enter", run: evaluateLine },
//   { key: "Mod-Enter", run: evaluateBlock },
// ];