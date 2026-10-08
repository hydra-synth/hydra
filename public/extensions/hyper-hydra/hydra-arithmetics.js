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
    const gS = _hydraScope.osc().constructor.prototype;

    function wrapColorCombine(name, color, combine) {
        gS[name] = function (arg, ...args) {
            let isArgument =
                typeof arg == "number" ||
                typeof arg == "function" ||
                typeof arg == "string" ||
                arg.constructor.name == "Array";
            return isArgument
                ? this[color](arg)
                : args.length
                ? this[combine](arg, ...args)
                : this[combine](arg);
        };
    }

    {
        const noInputs = (
            "abs,sign,fract," +
            "sin,cos,tan,asin,acos,atan," +
            "exp,log,exp2,log2,sqrt,inversesqrt"
        ).split(",");

        noInputs.forEach((name) => {
            _hydra.synth.setFunction({
                name: "_" + name,
                type: "color",
                inputs: [],
                glsl: `return ${name}(_c0);`,
            });
            gS[name] = gS["_" + name];
        });
    }

    {
        const singleArgument = "mod,min,max,step,pow".split(",");

        singleArgument.forEach((name) => {
            _hydra.synth.setFunction({
                name: "_" + name,
                type: "combine",
                inputs: [],
                glsl: `return ${name}(_c0,_c1);`,
            });
            _hydra.synth.setFunction({
                name: "_" + name + "_single",
                type: "color",
                inputs: [{ name: "_in", type: "float", default: 1 }],
                glsl: `return ${name}(_c0,vec4(_in));`,
            });
            wrapColorCombine(name, "_" + name + "_single", "_" + name);
        });
    }

    _hydra.synth.setFunction({
        name: "_div",
        type: "combine",
        inputs: [],
        glsl: `return _c0 / _c1;`,
    });
    _hydra.synth.setFunction({
        name: "_div_single",
        type: "color",
        inputs: [{ name: "_in", type: "float", default: 1 }],
        glsl: `return _c0 / _in;`,
    });
    wrapColorCombine("div", "_div_single", "_div");

    _hydra.synth.setFunction({
        name: "_add",
        type: "combine",
        inputs: [{ type: "float", name: "amount", default: 1 }],
        glsl: `return _c0 + (_c1*amount);`,
    });
    _hydra.synth.setFunction({
        name: "_add_single",
        type: "color",
        inputs: [{ name: "_in", type: "float", default: 1 }],
        glsl: `return _c0 + _in;`,
    });
    wrapColorCombine("add", "_add_single", "_add");

    _hydra.synth.setFunction({
        name: "_sub",
        type: "combine",
        inputs: [{ type: "float", name: "amount", default: 1 }],
        glsl: `return _c0 - (_c1*amount);`,
    });
    _hydra.synth.setFunction({
        name: "_sub_single",
        type: "color",
        inputs: [{ name: "_in", type: "float", default: 1 }],
        glsl: `return _c0 - _in;`,
    });
    wrapColorCombine("sub", "_sub_single", "_sub");

    _hydra.synth.setFunction({
        name: "_mult",
        type: "combine",
        inputs: [{ type: "float", name: "amount", default: 1 }],
        glsl: `return _c0*(1.0-amount)+(_c0*_c1)*amount;`,
    });
    _hydra.synth.setFunction({
        name: "_mult_single",
        type: "color",
        inputs: [{ name: "_in", type: "float", default: 1 }],
        glsl: `return _c0 * _in;`,
    });
    wrapColorCombine("mult", "_mult_single", "_mult");

    gS.amp = gS._mult_single;
    gS.amplitude = gS.amp;
    gS.offset = gS._add_single;
    gS.off = gS.offset;

    _hydra.synth.setFunction({
        name: "bipolar",
        type: "color",
        inputs: [{ name: "amp", type: "float", default: 1 }],
        glsl: `return ((_c0  * 2.0) - 1.0) * amp;`,
    });
    _hydra.synth.setFunction({
        name: "unipolar",
        type: "color",
        inputs: [{ name: "amp", type: "float", default: 1 }],
        glsl: `return ((_c0  + 1.0) * 0.5) * amp;`,
    });

    _hydra.synth.setFunction({
        name: "range",
        type: "color",
        inputs: [
            { name: "_min", type: "float", default: 0 },
            { name: "_max", type: "float", default: 1 },
        ],
        glsl: `return _c0 * (_max - _min) + _min;`,
    });
    _hydra.synth.setFunction({
        name: "birange",
        type: "color",
        inputs: [
            { name: "_min", type: "float", default: 0 },
            { name: "_max", type: "float", default: 1 },
        ],
        glsl: `return ((_c0  + 1.0) * 0.5) * (_max - _min) + _min;`,
    });
    _hydra.synth.setFunction({
        name: "_clamp",
        type: "color",
        inputs: [
            { name: "_min", type: "float", default: 0 },
            { name: "_max", type: "float", default: 1 },
        ],
        glsl: `return clamp(_c0, _min, _max);`,
    });
    gS.clamp = gS._clamp;

    _hydra.synth.setFunction({
        name: "x",
        type: "src",
        inputs: [
            { name: "mult", type: "float", default: 1 },
        ],
        glsl: `return vec4(vec3(_st.x*mult),1.0);`,
    });
    _hydra.synth.setFunction({
        name: "y",
        type: "src",
        inputs: [
            { name: "mult", type: "float", default: 1 },
        ],
        glsl: `return vec4(vec3(_st.y*mult),1.0);`,
    });
    _hydra.synth.setFunction({
        name: "length",
        type: "src",
        inputs: [
            { name: "mult", type: "float", default: 1 },
        ],
        glsl: `return vec4(vec3(length(_st*mult)),1.0);`,
    });
    _hydra.synth.setFunction({
        name: "distance",
        type: "src",
        inputs: [
            { name: "px", type: "float", default: 0 },
            { name: "py", type: "float", default: 0 },
        ],
        glsl: `return vec4(vec3(length(_st,vec2(px,py))),1.0);`,
    });

    _hydra.synth.setFunction({
        name: "xCenter",
        type: "src",
        inputs: [
            { name: "mult", type: "float", default: 1 },
        ],
        glsl: `return vec4(vec3((0.5-_st.x)*mult),1.0);`,
    });
    _hydra.synth.setFunction({
        name: "yCenter",
        type: "src",
        inputs: [
            { name: "mult", type: "float", default: 1 },
        ],
        glsl: `return vec4(vec3((0.5-_st.y)*mult),1.0);`,
    });
    _hydra.synth.setFunction({
        name: "lengthCenter",
        type: "src",
        inputs: [
            { name: "mult", type: "float", default: 1 },
        ],
        glsl: `return vec4(vec3(length((vec2(0.5)-_st)*mult)),1.0);`,
    });
    _hydra.synth.setFunction({
        name: "distanceCenter",
        type: "src",
        inputs: [
            { name: "px", type: "float", default: 0 },
            { name: "py", type: "float", default: 0 },
        ],
        glsl: `return vec4(vec3(length(vec2(0.5)-_st,vec2(0.5)-vec2(px,py))),1.0);`,
    });

}
