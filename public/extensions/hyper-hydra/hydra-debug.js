{
    const getHydra = function () {
        const whereami = window.location?.href?.includes("hydra.ojack.xyz")
            ? "editor"
            : window.atom?.packages
            ? "atom"
            : "idk";
        if (whereami === "editor") {
            return window.hydraSynth;
        }
        if (whereami === "atom") {
            return global.atom.packages.loadedPackages["atom-hydra"]
                .mainModule.main.hydra;
        }
        let _h = [
            window.hydraSynth,
            window._hydra,
            window.hydra,
            window.h,
            window.H,
            window.hy
        ].find(h => h?.regl);
        return _h;
    };
    window._hydra = getHydra();
    window._hydraScope = _hydra.sandbox.makeGlobal ? window : _hydra.synth;
}

// hydra-debug extension
(async function() {
    // Load dependencies
    await _hydraScope.loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
    );
    await _hydraScope.loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/glsl.min.js"
    );
    await _hydraScope.loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.1/beautify.js"
    );

    // Inject styles once
    const styleId = "hydra-debug-styles";
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            #hydra-debug {
                position: fixed;
                z-index: 99999;
                top: 5%;
                right: 2%;
                width: 40%;
                height: 90%;
                background: #2d2d2d;
                border-radius: 6px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                display: flex;
                flex-direction: column;
                font-family: 'Fira Code', 'Consolas', monospace;
                font-size: 13px;
            }
            #hydra-debug .toolbar {
                display: flex;
                gap: 6px;
                padding: 8px;
                background: #1a1a1a;
                border-radius: 6px 6px 0 0;
            }
            #hydra-debug button {
                background: #444;
                color: #fff;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            #hydra-debug button:hover {
                background: #555;
            }
            #hydra-debug .close-btn {
                margin-left: auto;
            }
            #hydra-debug pre {
                flex: 1;
                margin: 0;
                padding: 12px;
                overflow: auto;
                background: #2d2d2d;
            }
            #hydra-debug pre::-webkit-scrollbar {
                width: 10px;
                height: 10px;
            }
            #hydra-debug pre::-webkit-scrollbar-track {
                background: #1a1a1a;
            }
            #hydra-debug pre::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 5px;
            }
            #hydra-debug pre::-webkit-scrollbar-thumb:hover {
                background: #666;
            }
            #hydra-debug code {
                font-family: inherit;
                white-space: pre;
                outline: none;
                display: block;
                color: #ccc;
            }
            #hydra-debug code:focus {
                outline: 1px solid #666;
            }
            
            /* Syntax highlighting colors (tomorrow-night-eighties theme) */
            #hydra-debug .hljs-comment { color: #999; }
            #hydra-debug .hljs-keyword { color: #cc99cc; }
            #hydra-debug .hljs-built_in { color: #f99157; }
            #hydra-debug .hljs-type { color: #ffcc66; }
            #hydra-debug .hljs-literal { color: #f99157; }
            #hydra-debug .hljs-number { color: #f99157; }
            #hydra-debug .hljs-string { color: #99cc99; }
            #hydra-debug .hljs-title { color: #6699cc; }
            #hydra-debug .hljs-function { color: #6699cc; }
            #hydra-debug .hljs-params { color: #ccc; }
        `;
        document.head.appendChild(style);
    }

    function formatCode(code) {
        return js_beautify(code, { indent_size: 2 })
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    }

    function highlightCode(codeEl, sourceCode) {
        const formatted = formatCode(sourceCode);
        const result = hljs.highlight(formatted, { language: 'glsl' });
        codeEl.innerHTML = result.value;
    }

    function createPanel(glslSource, output) {
        // Remove existing panel
        document.getElementById("hydra-debug")?.remove();

        const passes = glslSource.glsl();
        const originalCode = passes[0].frag;

        // Create elements
        const panel = document.createElement("div");
        panel.id = "hydra-debug";

        const toolbar = document.createElement("div");
        toolbar.className = "toolbar";

        const pre = document.createElement("pre");
        const code = document.createElement("code");
        code.className = "hljs language-glsl";

        // Set initial code and highlight
        highlightCode(code, originalCode);
        pre.appendChild(code);

        // Make editable if output provided
        if (output) {
            code.contentEditable = "true";
            code.spellcheck = false;

            const runBtn = document.createElement("button");
            runBtn.textContent = "▶ Run";
            runBtn.onclick = () => {
                const newCode = code.textContent;
                passes[0].frag = newCode;
                output.render(passes);
                // Re-highlight after edit
                highlightCode(code, newCode);
            };
            toolbar.appendChild(runBtn);

            const resetBtn = document.createElement("button");
            resetBtn.textContent = "↺ Reset";
            resetBtn.onclick = () => {
                passes[0].frag = originalCode;
                output.render(passes);
                highlightCode(code, originalCode);
            };
            toolbar.appendChild(resetBtn);
        }

        const closeBtn = document.createElement("button");
        closeBtn.className = "close-btn";
        closeBtn.textContent = "✕";
        closeBtn.onclick = () => panel.remove();
        toolbar.appendChild(closeBtn);

        panel.appendChild(toolbar);
        panel.appendChild(pre);

        // Append to documentElement (html) - not body!
        // This avoids Hydra's DOM cleanup which only manages body
        document.documentElement.appendChild(panel);
    }

    // Add debug method to GlslSource prototype
    const GlslSource = _hydraScope.osc().constructor;
    GlslSource.prototype.debug = function(output) {
        createPanel(this, output);
        return output ? this.out(output) : this;
    };

    console.log("[hydra-debug] Extension loaded");
})();
