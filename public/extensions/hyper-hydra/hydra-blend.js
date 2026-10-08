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
    const blendingFuncs = {
        add2: "min(base+blend,1.0)",
        average: "(base+blend)/2.0",
        colorBurn: "(blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0)",
        colorDodge: "(blend==1.0)?blend:min(base/(1.0-blend),1.0)",
        darken: "min(blend,base)",
        difference: "abs(base-blend)",
        divide: "min(base/(blend+0.00000001),1.0)",
        exclusion: "base+blend-2.0*base*blend",
        glow: "(base==1.0)?base:min(blend*blend/(1.0-base),1.0)",
        hardLight:
            "blend<0.5?(2.0*blend*base):(1.0-2.0*(1.0-blend)*(1.0-base))",
        hardMix:
            "(((blend<0.5)?((blend==0.0)?(blend):max((1.0-((1.0-base)/(2.0*blend))),0.0)):(((2.0*(blend-0.5))==1.0)?(2.0*(blend-0.5)):min(base/(1.0-(2.0*(blend-0.5))),1.0)))<0.5)?0.0:1.0",
        lighten: "max(blend,base)",
        linearBurn: "max(base+blend-1.0,0.0)",
        linearDodge: "min(base+blend,1.0)",
        linearLight:
            "blend<0.5?(max(base+(2.0*blend)-1.0,0.0)):min(base+(2.0*(blend-0.5)),1.0)",
        multiply: "base*blend",
        negation: "1.0-abs(1.0-base-blend)",
        overlay: "base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend))",
        phoenix: "min(base,blend)-max(base,blend)+vec3(1.0)",
        pinLight: "(blend<0.5)?min(base,2.0*blend):max(base,2.0*(blend-0.5))",
        reflect: "(blend==1.0)?blend:min(base*base/(1.0-blend),1.0)",
        screen: "1.0-((1.0-base)*(1.0-blend))",
        softLight:
            "(blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend))",
        subtract: "max(base+blend-1.0,0.0)",
        vividLight:
            "(blend<0.5)?((blend==0.0)?(blend):max((1.0-((1.0-base)/(2.0*blend))),0.0)):(((2.0*(blend-0.5))==1.0)?(2.0*(blend-0.5)):min(base/(1.0-(2.0*(blend-0.5))),1.0))",
    };

    Object.entries(blendingFuncs).forEach(([mode, def]) => {
        let glsl =
            "vec3 rgb;\n\n" +
            //"_c0 = clamp(_c0, 0.0, 1.0);" +
            //"_c1 = clamp(_c1, 0.0, 1.0);" +
            ["r", "g", "b"].reduce((acc, elem) => {
                return (
                    acc +
                    (`rgb.${elem} = ` +
                        def
                            .replaceAll("base", "_c0." + elem)
                            .replaceAll("blend", "_c1." + elem) +
                        ";\n\n")
                );
            }, "") +
            "_c1.a *= amount;" +
            "vec4 blended = vec4(mix(_c0.rgb, rgb, _c1.a), 1.0);" +
            "vec4 over = _c1+(_c0*(1.0-_c1.a));" +
            "return mix(blended, over, 1.0-_c0.a);";
        _hydra.synth.setFunction({
            name: mode,
            type: "combine",
            inputs: [{ name: "amount", type: "float", default: 1 }],
            glsl,
        });
    });
}

_hydra.synth.setFunction({
    name: "layer",
    type: "combine",
    inputs: [
        {
            type: "float",
            name: "amount",
            default: 1,
        },
    ],
    glsl: `
        _c0.a = clamp(_c0.a, 0.0, 1.0);
        _c1.a = clamp(_c1.a, 0.0, 1.0);
        return _c1+(_c0*(1.0-_c1.a));
        `,
});
_hydra.synth.setFunction({
    name: "mask",
    type: "combine",
    inputs: [],
    glsl: `
        float a = _luminance(_c1.rgb);
        return vec4(_c0.rgb*a, _c0.a*a);
        `,
});
_hydra.synth.setFunction({
    name: "luma",
    type: "color",
    inputs: [
        {
            type: "float",
            name: "threshold",
            default: 0.5,
        },
        {
            type: "float",
            name: "tolerance",
            default: 0.1,
        },
    ],
    glsl: `
        float a = smoothstep(threshold-(tolerance+0.0000001), threshold+(tolerance+0.0000001), _luminance(_c0.rgb*_c0.a));
        return vec4(_c0.rgb*a, a);
        `,
});
_hydra.synth.setFunction({
    name: "clamp",
    type: "color",
    inputs: [],
    glsl: ` 
        return clamp(_c0,0.0,1.0);
        `,
});
_hydra.synth.setFunction({
    name: "premultiply",
    type: "color",
    inputs: [],
    glsl: ` 
        _c0 = clamp(_c0,0.0,1.0);
        return vec4(_c0.rgb*_c0.a,_c0.a);
        `,
});

{
    const gS = _hydraScope.osc().constructor.prototype;

    gS.pm = gS.premultiply;

    gS.negate = gS.negation;
}
