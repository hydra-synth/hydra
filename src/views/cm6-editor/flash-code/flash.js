import { EditorState, StateEffect } from "@codemirror/state";

export const flashEffect = StateEffect.define();

// export type flashHandler = (code) => void;

export function flashAction(action = () => {}) {
  return EditorState.transactionExtender.of((tr) => {
    for (let effect of tr.effects) {
      if (effect.is(flashEffect)) {
        let { from, to, shouldUpdateURL } = effect.value;
        action(tr.newDoc.sliceString(from, to), shouldUpdateURL);
      }
    }

    return null;
  });
}
