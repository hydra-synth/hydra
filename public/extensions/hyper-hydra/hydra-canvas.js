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

_hydraScope.canvas = window._hydra.canvas;

_hydraScope.canvas.setLinear = function () {
    this.style.imageRendering = "auto";
};
_hydraScope.canvas.setNearest = function () {
    this.style.imageRendering = "pixelated";
};
_hydraScope.canvas.setFullscreen = function (full = true) {
    const set = full ? "100%" : "";
    this.style.width = set;
    this.style.height = set;
};
_hydraScope.canvas.setAlign = function (align = "right") {
    this.style.position = "relative";
    this.parentElement.style["text-align"] = align;
};
_hydraScope.canvas.setRelativeSize = function (ratio) {
    this.style.width = "" + width * ratio + "px";
    this.style.height = "" + height * ratio + "px";
};
