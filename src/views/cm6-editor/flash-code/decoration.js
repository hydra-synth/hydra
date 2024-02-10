import { ViewPlugin, ViewUpdate, Decoration } from "@codemirror/view";
import { Transaction } from "@codemirror/state";

import { flashEffect } from "./flash";

export function flashDecoration() {
  const lifespan = 500;

  return ViewPlugin.fromClass(
    class {
      decorations = Decoration.none;

      update({ transactions }) {
        for (let tr of transactions) {
          this.decorations = this.decorations.map(tr.changes);

          this.decorations = this.decorations.update({
            add: tr.effects
              .filter((e) => e.is(flashEffect) && e.value.from !== e.value.to)
              .map(({ value: { from, to } }) =>
                Decoration.mark({
                  class: "cm-evaluated",
                  time: tr.annotation(Transaction.time),
                }).range(from, to)
              ),
            sort: true,
            filter: (_f, _t, { spec: { time } }) => {
              return typeof time === "number" && time + lifespan > Date.now();
            },
          });
        }
      }
    },
    { decorations: (v) => v.decorations }
  );
}
