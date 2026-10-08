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

[
    {
        name: "mirrorX",
        type: "coord",
        inputs: [
            {
                type: "float",
                name: "pos",
                default: 0,
            },
            {
                type: "float",
                name: "coverage",
                default: 1,
            },
        ],
        glsl: `_st.x = (0.0-abs(fract(_st.x/coverage)-(1.0-0.5-pos))+0.5-pos)*coverage; return _st;`,
    },
    {
        name: "mirrorY",
        type: "coord",
        inputs: [
            {
                type: "float",
                name: "pos",
                default: 0,
            },
            {
                type: "float",
                name: "coverage",
                default: 1,
            },
        ],
        glsl: `_st.y = (0.0-abs(fract(_st.y/coverage)-(1.0-0.5-pos))+0.5-pos)*coverage; return _st;`,
    },
    {
        name: "mirrorX2",
        type: "coord",
        inputs: [
            {
                type: "float",
                name: "pos",
                default: 0,
            },
            {
                type: "float",
                name: "coverage",
                default: 1,
            },
        ],
        glsl: `_st.x = (abs(fract(_st.x/coverage)-(1.0-0.5-pos))+0.5-pos)*coverage; return _st;`,
    },
    {
        name: "mirrorY2",
        type: "coord",
        inputs: [
            {
                type: "float",
                name: "pos",
                default: 0,
            },
            {
                type: "float",
                name: "coverage",
                default: 1,
            },
        ],
        glsl: `_st.y = (0.0-abs(fract(_st.y/coverage)-(1.0-0.5-pos))+0.5-pos)*coverage; return _st;`,
    },
    {
        name: "mirrorWrap",
        type: "coord",
        inputs: [],
        glsl: `return -abs(fract(_st/2.0)*2.0-1.0)+1.0;`,
    },
    {
        name: "inversion",
        type: "coord",
        inputs: [],
        glsl: `_st /= dot(_st,_st); return _st;`,
    },
].forEach((x) => _hydra.synth.setFunction(x));
