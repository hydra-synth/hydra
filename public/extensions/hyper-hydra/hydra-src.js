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

{
    const canvas = _hydra.canvas;
    const scope = (_hydraScope.srcMask = function (tex) {
        return _hydraScope.src(tex).mask(shape(4, 1, 0));
    });
    _hydraScope.srcAbs = function (tex) {
        if (!tex.hasOwnProperty("src")) return src(tex);
        const w = () => tex.src?.width || tex.src?.videoWidth || 0;
        const h = () => tex.src?.height || tex.src?.videoHeight || 0;
        return _hydraScope.src(tex).scale(
            1,
            () => w() / canvas.clientWidth,
            () => h() / canvas.clientHeight
        );
    };
    _hydraScope.srcAbsMask = function (tex) {
        if (!tex.hasOwnProperty("src")) return src(tex);
        const w = () => tex.src?.width || tex.src?.videoWidth || 0;
        const h = () => tex.src?.height || tex.src?.videoHeight || 0;
        return _hydraScope.srcMask(tex).scale(
            1,
            () => w() / canvas.clientWidth,
            () => h() / canvas.clientHeight
        );
    };
    _hydraScope.srcRel = function (tex) {
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
        const cw = () => canvas.clientWidth / canvas.clientHeight;
        const ch = () => canvas.clientHeight / canvas.clientWidth;
        return _hydraScope.src(tex).scale(
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
        const cw = () => canvas.clientWidth / canvas.clientHeight;
        const ch = () => canvas.clientHeight / canvas.clientWidth;
        return _hydraScope.srcMask(tex).scale(
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
    
    const gS = _hydraScope.osc().constructor.prototype;
  	gS.rotateRel = function(...args){
    	return this .scale(1,canvas.clientWidth/canvas.clientHeight)
      				.rotate(...args)
      				.scale(1,canvas.clientHeight/canvas.clientWidth)
    }
    gS.correctScaleRel = function(source){
        const tex = source;
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
        const cw = () => canvas.clientWidth / canvas.clientHeight;
        const ch = () => canvas.clientHeight / canvas.clientWidth;
        return this.scale(
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
    }
    gS.noWrap = function(sm=0){
        return this.mask(shape(4, 1, sm));
    }
}
