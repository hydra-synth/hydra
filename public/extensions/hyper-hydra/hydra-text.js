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

_hydraScope.srcRelMask = function (tex) {
    if (!tex.hasOwnProperty("src")) return src(tex);
    const w = () =>
        tex.src?.width
            ? tex.src?.width / tex.src?.height
            : tex.src?.videoWidth
            ? tex.src?.videoWidth / tex.src?.videoHeight
            : 0;
    const h = () =>
        tex.src?.height
            ? tex.src?.height / tex.src?.width
            : tex.src?.videoHeight
            ? tex.src?.videoHeight / tex.src?.videoWidth
            : 0;
    const cw = () => _hydra.canvas.clientWidth / _hydra.canvas.clientHeight;
    const ch = () => _hydra.canvas.clientHeight / _hydra.canvas.clientWidth;
    return _hydraScope
        .src(tex)
        .mask(shape(4, 1, 0))
        .scale(
            1,
            () => {
                const _cw = cw();
                const _w = w();
                return _cw > _w ? _w / _cw : 1;
            },
            () => {
                const _ch = ch();
                const _h = h();
                return _ch > _h ? _h / _ch : 1;
            }
        );
};

{
    const Source = _hydra.s[0].constructor;
    
    // Default settings
    window.hydraText = {
        font: "sans-serif",
        fontStyle: "normal",
        fontSize: "auto",
        textAlign: "center",
        fillStyle: "white",
        strokeStyle: "white",
        lineWidth: "2%",
        lineJoin: "miter",
        canvasResize: 2,
        interpolation: "linear"
    };

    // Utility functions
    function isPercentage(property) {
        return String(property).endsWith("%");
    }
    
    function getPercentage(property) {
        return Number(property.substring(0, property.length - 1)) / 100;
    }

    // Core text rendering function - renders to an existing canvas context
    function renderText(ctx, canvas, str, _config, fill, stroke, fillAfter) {
        const lines = str.split("\n");
        const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b);

        if (typeof _config === "string") _config = { font: _config };

        const config = Object.assign({}, hydraText, _config);
        const font = config.font;
        const fontStyle = config.fontStyle;
        config.textBaseline = "middle";

        const fontWithSize = (size) => `${fontStyle} ${size} ${font}`;

        // Calculate dimensions
        canvas.width = _hydra.width;
        ctx.font = fontWithSize("1px");
        let padding = _hydra.width / 20;
        let textWidth = _hydra.width - padding;
        let fontSize = textWidth / ctx.measureText(longestLine).width;
        canvas.height = fontSize * 1.4 * lines.length;

        if (isPercentage(config.fontSize)) fontSize *= getPercentage(config.fontSize);
        else if (config.fontSize !== "auto") fontSize = Number(config.fontSize.replace(/[^0-9.,]+/, ''));
        if (isPercentage(config.lineWidth)) config.lineWidth = fontSize * getPercentage(config.lineWidth);

        fontSize *= config.canvasResize;
        canvas.width *= config.canvasResize;
        canvas.height *= config.canvasResize;
        textWidth *= config.canvasResize;
        padding *= config.canvasResize;
        config.lineWidth *= config.canvasResize;

        // Clear and setup context
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        config.font = fontWithSize(String(fontSize) + "px");
        Object.assign(ctx, config);

        let x = 0;
        if (ctx.textAlign === "center") x = canvas.width / 2;
        else if (ctx.textAlign === "left") x = padding / 2;
        else if (ctx.textAlign === "right") x = canvas.width - padding / 2;

        lines.forEach((line, i) => {
            const y = (canvas.height / (lines.length + 1)) * (i + 1);
            if (fill) ctx.fillText(line, x, y, textWidth);
            if (stroke) ctx.strokeText(line, x, y, textWidth);
            if (fillAfter) ctx.fillText(line, x, y, textWidth);
        });

        return config.interpolation;
    }

    // createText factory function - returns a Source with text rendering methods
    _hydraScope.createText = function() {
        const source = new Source({
            regl: _hydra.regl,
            pb: _hydra.pb,
            width: _hydra.width,
            height: _hydra.height,
        });
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let initialized = false;
        
        const createTextMethod = (fill, stroke, fillAfter) => {
            return function(str, config) {
                const interpolation = renderText(ctx, canvas, str, config, fill, stroke, fillAfter);
                
                if (!initialized) {
                    // First time: init creates the texture
                    source.init(
                        { src: canvas },
                        { min: interpolation, mag: interpolation }
                    );
                    source.dynamic = true;
                    initialized = true;
                } else {
                    // Subsequent times: just update the texture with subimage
                    source.tex.subimage(canvas);
                }
                
                return source;
            };
        };

        source.text = createTextMethod(true, false, false);
        source.strokeText = createTextMethod(false, true, false);
        source.fillStrokeText = createTextMethod(true, true, false);
        source.strokeFillText = createTextMethod(false, true, true);

        return source;
    };

    // One-shot functions (original API, creates new canvas each time)
    function createOneShot(str, config, fill, stroke, fillAfter) {
        const source = new Source({
            regl: _hydra.regl,
            pb: _hydra.pb,
            width: _hydra.width,
            height: _hydra.height,
        });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const interpolation = renderText(ctx, canvas, str, config, fill, stroke, fillAfter);
        source.init({ src: canvas }, { min: interpolation, mag: interpolation });
        return _hydraScope.srcRelMask(source);
    }

    _hydraScope.text = function(str, config) {
        return createOneShot(str, config, true, false, false);
    };

    _hydraScope.strokeText = function(str, config) {
        return createOneShot(str, config, false, true, false);
    };

    _hydraScope.fillStrokeText = function(str, config) {
        return createOneShot(str, config, true, true, false);
    };

    _hydraScope.strokeFillText = function(str, config) {
        return createOneShot(str, config, false, true, true);
    };

    console.log("[hydra-text] Extension loaded");
}
