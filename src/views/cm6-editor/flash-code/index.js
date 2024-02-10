import { keymap } from "@codemirror/view";
// import { Extension } from "@codemirror/state";

import { flashAction } from "./flash";
// import { flashKeymap } from "./flashKeymaps";
import { flashDecoration } from "./decoration";
// import { flashTheme } from "./theme";

export * from "./flash";
export * from "./flashKeymaps";
export { flashDecoration } from "./decoration";
// export { evalTheme } from "./theme";

export function flash(action){
  return [
    flashAction(action),
    flashDecoration(),
    // evalTheme,
    // keymap.of(evalKeymap),
  ];
}