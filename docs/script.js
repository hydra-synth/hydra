/* global Torus jdom css */
/* global Hydra */
/* global CodeMirror */

let hydra, hydraCanvas;
hydraCanvas = document.createElement("canvas");
hydraCanvas.width = 512;
hydraCanvas.height = 512;
hydraCanvas.id = "hydraCanvas";

hydra = new Hydra({
  canvas: hydraCanvas,
  detectAudio: false,
  enableStreamCapture: false,
  width: 512,
  height: 512
});

// class HydraApp extends Torus.StyledComponent {
//   init() {
//     this.canvas = document.createElement("CANVAS");
//     this.canvas.width = window.innerWidth;
//     this.canvas.height = window.innerHeight;
//     this.hydra = new Hydra({
//       canvas: this.canvas,
//       detectAudio: false,
//       enableStreamCapture: false
//     });
    
//     const resize = (w, h) => {
//       this.hydra.setResolution(w, h);
//       this.canvas.width = w;
//       this.canvas.height = h;
//     }
//     resize(512, 512);
//   }
//   styles() {
//     return css`
//       position: relative;
//       width: 100%;
//       height: 100%;
//     `;
//   }
//   compose() {
//     return jdom`<div>${this.canvas}</div>`;
//   }
// }

class CodeApp extends Torus.StyledComponent {
  init() {
    this.el = document.createElement("TEXTAREA");
    this.console = "";
    this.consoleClass = "";
    this.showEditor = true;
    this.lastCode = "";

    // https://github.com/ojack/hydra/blob/3dcbf85c22b9f30c45b29ac63066e4bbb00cf225/hydra-server/app/src/editor.js
    this.flashCode = (l0, l1) => {
      if (l0 === undefined) l0 = this.cm.firstLine();
      if (l1 === undefined) l1 = this.cm.lastLine() + 1;
      let count = 0;
      for (let l = l0; l < l1; l++) {
        const start = { line: l, ch: 0 };
        const end = { line: l + 1, ch: 0 };
        const marker = this.cm.markText(start, end, {
          css: "background-color: salmon;"
        });
        setTimeout(() => marker.clear(), 300);
        count++;
      }
    };

    const getLine = () => {
      const c = this.cm.getCursor();
      const s = this.cm.getLine(c.line);
      this.flashCode(c.line, c.line + 1);
      return s;
    };

    this.getCurrentBlock = () => {
      // thanks to graham wakefield + gibber
      const pos = this.cm.getCursor();
      let startline = pos.line;
      let endline = pos.line;
      while (startline > 0 && this.cm.getLine(startline) !== "") {
        startline--;
      }
      while (endline < this.cm.lineCount() && this.cm.getLine(endline) !== "") {
        endline++;
      }
      const pos1 = {
        line: startline,
        ch: 0
      };
      const pos2 = {
        line: endline,
        ch: 0
      };
      const str = this.cm.getRange(pos1, pos2);

      this.flashCode(startline, endline);

      return str;
    };

    this.evalCode = c => {
      try {
        let result = eval(c);
        if (result === undefined) result = "";
        this.console = result;
        this.consoleClass = "normal";
        this.lastCode = c;
        // localStorage.setItem("hydracode", this.cm.getValue());
      } catch (e) {
        console.log(e);
        this.console = e + "";
        this.consoleClass = "error";
      }
      this.render();
    };

    this.commands = {
      evalAll: () => {
        const code = this.cm.getValue();
        this.flashCode();
        this.evalCode(code);
      },
      toggleEditor: () => {
        this.showEditor = !this.showEditor;
        this.render();
      },
      evalLine: () => {
        const code = getLine();
        this.evalCode(code);
      },
      toggleComment: () => {
        this.cm.toggleComment();
      },
      evalBlock: () => {
        const code = this.getCurrentBlock();
        this.evalCode(code);
      }
    };

    const keyMap = {
      evalAll: { key: "ctrl+shift+enter" },
      toggleEditor: { key: "ctrl+shift+h" },
      toggleComment: { key: "ctrl+/" },
      evalLine: { key: "shift+enter,ctrl+enter" },
      evalBlock: { key: "alt+enter" }
    };
  }
  setCode(c) {
    this.cm.setValue(c);
    this.evalCode(this.cm.getValue());
  }
  getLastCode() {
    return this.lastCode; // tricky one - not cm.getCode
  }
  loaded(code) {
    if (this.cm == undefined) {
      this.cm = CodeMirror.fromTextArea(this.el, {
        theme: "paraiso-dark",
        value: "a",
        mode: { name: "javascript", globalVars: true },
        lineWrapping: true,
        styleSelectedText: true
      });      
      
      const urlParams = new URLSearchParams(window.location.search);
      this.setCode(code);
    }
    this.cm.refresh();
  }
  styles() {
    return css`
      position: relative;
      box-sizing: border-box;
      margin: 15px 0;
      width: 100%;
      height: auto;
      display: flex;
      justify-content: center;
      .editor-box {
        position: static;
        // border: solid black;
        background-color: #ddd;
        width: 100%;
        max-width: 512px;
      }
      .openin {
        cursor: pointer;
      }
      .editor-container {
        font-family: monospace;
        position: relative;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        z-index: 1;
        width: 100%;
        height: 10em;
        background-color: black;
      }
      .editor-console {
        position: relative;
        font-family: monospace;
        font-variant-ligatures: no-common-ligatures;
        color: black;
        z-index: 1;
      }
      .editor-console > * {
        display: inline;
      }
      .error {
        color: crimson;
      }
      .hide {
        visibility: hidden;
      }
    `;
  }
  compose() {
    return jdom`
    <div>
      <div class="editor-box">
        <a class="openin" onclick="${
          () => window.open(`https://hydra.ojack.xyz/?code=${btoa(
                encodeURIComponent(this.getLastCode())
              )}`)
        }">
          open in editor⤴
        </a>
              
        <div class="editor-container ${this.showEditor ? "" : "hide"}">
          ${this.el}
        </div>
      
        <div class="editor-console">
          <button onclick=${ () => {
            this.commands.evalAll();
          } }>run</>
          >> <div class="${this.consoleClass}">${this.console}</div>
        </div>
      </div>
    </div>
    `;
  }
}

// const app = new App();
// document.querySelector("div#torusapp").appendChild(app.node);
// app.loaded();

window.$docsify = {
  auto2top: true,
  loadSidebar: true,
  relativePath: true,
  subMaxLevel: 3,
  homepage: 'README.md',
  name: "",
  repo: "",
  plugins: [
    // https://github.com/baku89/glisp/blob/master/docs/index.html
    function(hook, vm) {
      hook.afterEach((html, next) => {
        html = html.replace(
          /data-lang="javascript"/gi,
          'data-lang="javascript" class="hydra-code"'
        );
        next(html);
      });

      const placeholders = [];

      hook.doneEach(() => {
        const isNotTop = true;
        const codeBlocks = document.querySelectorAll("pre.hydra-code");

        codeBlocks.forEach(preEl => {
          const parentEl = preEl.parentElement;
          const codeEl = preEl.firstChild;
          const originalCode = codeEl.textContent;

          let codeApp = new CodeApp();
          preEl.insertAdjacentElement("afterend", codeApp.node);
          codeApp.loaded(originalCode);
          preEl.style.display = "none";
          if (isNotTop) {
          } else {
            preEl.style.display = "none";
          }

          const placeholder = document.createElement("div");
          placeholder.style.width = "100%";
          placeholder.style.height = "512px";
          placeholder.style.display = "flex";
          placeholder.style.justifyContent = "center";
          
          placeholder.classList.add("hydracontainer");
          placeholders.push(placeholder);
          preEl.insertAdjacentElement("afterend", placeholder);

          var observer = new IntersectionObserver(
            function(entries) {
              if (entries[0].isIntersecting === true) {
                hush();
                solid(0, 0, 0, 0).out(o0);
                solid(0, 0, 0, 0).out(o1);
                solid(0, 0, 0, 0).out(o2);
                solid(0, 0, 0, 0).out(o3);
                render(o0);
                setTimeout(() => {
                  eval(codeApp.getLastCode());
                }, 60);
                placeholder.appendChild(hydraCanvas);

                // the "better" way - takes more power? weird alpha?
                // eval(codeEl.textContent);
                // update = () => {
                // }
                // setTimeout(() => {
                //   update = () => {
                //     c.getContext('2d').drawImage(hydraCanvas, 0, 0);
                //   }
                // }, 60);
              }
            },
            { threshold: [0.5] }
          );

          observer.observe(placeholder);
        });
      });

      hook.mounted(() => {
        // Called after initial completion. Only trigger once, no arguments.
        // document.querySelector("main").appendChild(hydraCanvas);
      });
    }
  ]
};