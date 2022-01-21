/* global Torus jdom css */
/* global Hydra */
/* global CodeMirror */

class HydraApp extends Torus.StyledComponent {
  init() {
    this.canvas = document.createElement("CANVAS");
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.hydra = new Hydra({
      canvas: this.canvas,
      detectAudio: false,
      enableStreamCapture: false,
      width: 512,
      height: 512,
    });
  }
  styles() {
    return css`
      position: relative;
    `;
  }
  compose() {
    return jdom`<div>${this.canvas}</div>`;
  }
}

const hydraApp = new HydraApp();

class CodeMirrorApp extends Torus.StyledComponent {
  init(app) {
    this.app = app;
    this.el = document.createElement("TEXTAREA");
    this.console = "";
    this.consoleClass = "";
    this.lastCode = "";
    this.originalCode = "";

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
        if (c == this.originalCode) {
          this.app.notSupportedInEmbeddedEditor();
        }
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
  }
  setCode(c) {
    this.cm.setValue(c);
    if (this.lastCode.length == 0) {
      this.lastCode = c;
      this.originalCode = c;
    }
  }
  getLastCode() {
    return this.lastCode; // tricky one - not cm.getCode
  }
  resetCode() {
    this.cm.setValue(this.originalCode);
    this.commands.evalAll();
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

      const keymap = {
        "Ctrl-Enter": (cm) => {
          this.commands.evalAll();
        }
      }
      this.cm.addKeyMap(keymap);
      
      this.setCode(code);
    }
    this.cm.refresh();
  }
  styles() {
    return css`
      position: static;
      background-color: #444;
      width: 100%;
      max-width: 512px;
      .editor-menu {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-end;
        align-items: center;
        align-content: stretch;
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
        color: white;
        z-index: 1;
      }
      .editor-console > * {
        display: inline;
      }
      .error {
        color: salmon;
      }
    `;
  }
  compose() {
    return jdom`
    <div>
      <div class="editor-menu">
        <button title="run" onclick=${ () => {
          this.commands.evalAll();
        } }>▶</>

        <button title="reset code" onclick="${
          () => this.resetCode()
        }">
          💔
        </button>
        <button title="open in editor" onclick="${
          () => window.open(`https://hydra.ojack.xyz/?code=${btoa(
                encodeURIComponent(this.getLastCode())
              )}`)
        }">
          🚀
        </button>
      </div>
      <div class="editor-container">
        ${this.el}
      </div>
    
      <div class="editor-console">
        >> <div class="${this.consoleClass}">${this.console}</div>
      </div>
    </div>
    `;
  }
}

class CodeApp extends Torus.StyledComponent {
  init() {
    this.showNotSupportedInEmbeddedEditor = false;
    this.cmApp = new CodeMirrorApp(this);
    this.placeholder = document.createElement("div");
    this.placeholder.className = "placeholder"
    
    var observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          hush();
          solid(0, 0, 0, 0).out(o0);
          solid(0, 0, 0, 0).out(o1);
          solid(0, 0, 0, 0).out(o2);
          solid(0, 0, 0, 0).out(o3);
          render(o0);
          setTimeout(() => {
            this.cmApp.commands.evalAll();
          }, 60);
          this.placeholder.appendChild(hydraApp.node);
        }
      },
      { threshold: [0.5] }
    );

    observer.observe(this.placeholder);
  }
  notSupportedInEmbeddedEditor() {
    this.showNotSupportedInEmbeddedEditor = true;
    this.render();
  }
  styles() {
    return css`
      position: relative;
      box-sizing: border-box;
      margin: 50px 0;
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      .placeholder {
        width: 100%;
        height: 512px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .not-supported-message {
        background-color: black;
        color: white;
        font-size: 1.25em;
        width: 100%;
        max-width: 512px;
      }
    `;
  }
  compose() {
    let placeholder = this.placeholder;
    if (this.showNotSupportedInEmbeddedEditor) {
      placeholder = jdom`
      <div class="placeholder">
        <div class="not-supported-message">
          Sorry, this example is not supported here. Please press "open in editor" below to try it in the original editor!
        </div>
      </div>`;
    }
    return jdom`
    <div>
      ${ placeholder }
      ${ this.cmApp.node }
    </div>
    `;
  }
}

window.$docsify = {
  auto2top: true,
  loadSidebar: true,
  // relativePath: true,
  subMaxLevel: 3,
  homepage: 'README.md',
  name: "Hydra",
  repo: "ojack/hydra",
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

      hook.doneEach(() => {
        const codeBlocks = document.querySelectorAll("pre.hydra-code");

        codeBlocks.forEach(preEl => {
          const codeEl = preEl.firstChild;
          const originalCode = codeEl.textContent;

          let codeApp = new CodeApp();
          preEl.insertAdjacentElement("afterend", codeApp.node);
          codeApp.cmApp.loaded(originalCode);
          preEl.style.display = "none";
        });
      });

      hook.mounted(() => {
        // Called after initial completion. Only trigger once, no arguments.
      });
    }
  ]
};
