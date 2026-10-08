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

window.gS = _hydraScope.osc().constructor.prototype;

{
    const hcs = {};

    hcs.colorspaces = [
        {
            name: "rgb",
            elems: ["r", "g", "b", "a"],
            to: "r = _r; g = _g; b = _b; a = _a;",
            from: "_r = r; _g = g; _b = b; _a = a;",
        },
        {
            name: "cmyk",
            elems: ["c", "m", "y", "k"],
            to: `
                k = 1.0-max(_r,max(_g,_b));
                c = (1.0-_r-k) / (1.0-k);
                m = (1.0-_g-k) / (1.0-k);
                y = (1.0-_b-k) / (1.0-k);
                `,
            from: `
                _r = (1.0-c)*(1.0-k);
                _g = (1.0-m)*(1.0-k);
                _b = (1.0-y)*(1.0-k);
                `,
        },
        {
            name: "hsv",
            elems: ["h", "s", "v"],
            to: `
                vec3 _hsv = _rgbToHsv(vec3(_r,_g,_b));
                h = _hsv.x; s = _hsv.y; v = _hsv.z;
                `,
            from: `
                vec3 _rgb = _hsvToRgb(vec3(h,s,v));
                _r = _rgb.r; _g = _rgb.g; _b = _rgb.b;
                `,
        },
        {
            name: "hsl",
            elems: ["h", "s", "l"],
            to: `
                vec3 _hsv = _rgbToHsv(vec3(_r,_g,_b));
                h = _hsv.x; 
                l = _hsv.z*(1.0-(_hsv.y*0.5));
                s = (_hsv.z-l)/(min(l,1.0-l));
                s *= step(-l,-0.000001)*step(l,0.999999);
                `,
            from: `
                _hsv.x = h; 
                _hsv.z = l + (s*min(l,1.0-l)); 
                _hsv.y = 2.0*(1.0-(l/_hsv.z))*step(-_hsv.z,-0.000001);
                vec3 _rgb = _hsvToRgb(_hsv);
                _r = _rgb.r; _g = _rgb.g; _b = _rgb.b;
                `,
        },
        {
            name: "yuv",
            elems: ["y", "u", "v"],
            to: `
                mat3 rgb2yuv = mat3(0.2126, 0.7152, 0.0722, -0.09991, -0.33609, 0.43600, 0.615, -0.5586, -0.05639);
                vec3 _yuv = vec3(_r,_g,_b) * rgb2yuv;
                y = _yuv.x; u = _yuv.y; v = _yuv.z;
                `,
            from: `
                mat3 yuv2rgb = mat3(1.0, 0.0, 1.28033, 1.0, -0.21482, -0.38059, 1.0, 2.12798, 0.0);
                vec3 _rgb = vec3(y,u,v) * yuv2rgb;
                _r = _rgb.r; _g = _rgb.g; _b = _rgb.b;
                `,
        },
        {
            name: "yiq",
            elems: ["y", "i", "q"],
            to: `
                mat3 rgb2yiq = mat3(0.299, 0.587, 0.114, 0.5959, -0.2746, -0.3213, 0.2115, -0.5227, 0.3112);
                vec3 _yiq = vec3(_r,_g,_b) * rgb2yiq;
                y = _yiq.x; i = _yiq.y; q = _yiq.z;
                `,
            from: `
                  mat3 yiq2rgb = mat3(1.0, 0.956, 0.619, 1.0, -0.272, -0.647, 1.0, -1.106, 1.703);
                  vec3 _rgb = vec3(y,i,q) * yiq2rgb;
                  _r = _rgb.r; _g = _rgb.g; _b = _rgb.b;
                `,
        },
    ];

    // utils

    hcs.generateInputAssignment = function (elems, format) {
        return format
            ? elems
                  .map((el) => {
                      let assign = format;
                      if (
                          "yuvalpha,yiqalpha".includes(elems.join("")) &&
                          "uviq".includes(el) &&
                          assign.includes("1.0 - #el")
                      ) {
                          assign = assign.replaceAll("1.0 - #el", "0.0 - #el");
                      } // TODO: find a better solution for this patch on inversion
                      return assign
                          .replaceAll("#el", el)
                          .replaceAll("#in", "in_" + el);
                  })
                  .join("")
            : "";
    };

    hcs.generateDirectAssignment = function (elems, tofrom) {
        const rgba = ["_r", "_g", "_b", "_a"];
        return tofrom == "to"
            ? elems.map((el, i) => rgba[i] + " = " + el + ";").join("")
            : elems.map((el, i) => el + " = " + rgba[i] + ";").join("");
    };

    hcs.generateDeclarations = function (elems, type = "float") {
        return elems.map((el) => type + " " + el + ";\n").join("");
    };

    // functions that use all elems

    hcs.generateFunction = function ({
        colorspace,
        sufix,
        type,
        assignmentFormat,
        inputDefault,
        alphaDefault = 1,
        tofrom,
    }) {
        const name = colorspace.name + (sufix ? "_" + sufix : "");

        const hasColorInput = ["color", "combine"].includes(type);

        const isRgb = "rgba".includes(colorspace.name);
        const elems =
            isRgb || tofrom
                ? colorspace.elems
                : colorspace.elems.concat("alpha");

        const inputs = assignmentFormat
            ? elems.map((el) => ({
                  type: "float",
                  name: "in_" + el,
                  default: inputDefault,
              }))
            : [];
        inputs.length ? (inputs.at(-1).default = alphaDefault) : null;

        const rgbaDeclarations = hcs.generateDeclarations([
            "_r",
            "_g",
            "_b",
            "_a",
        ]);
        const rgbaAssignments = hasColorInput
            ? "_r = _c0.r; _g = _c0.g; _b = _c0.b; _a = _c0.a;"
            : "";

        const elemDeclarations =
            hcs.generateDeclarations(elems) +
            (isRgb || tofrom ? "" : "alpha = _a;");
        const to = hasColorInput || tofrom == "to" ? colorspace.to : "";
        const elemAssignments = assignmentFormat
            ? hcs.generateInputAssignment(elems, assignmentFormat)
            : hcs.generateDirectAssignment(elems, tofrom);
        const from = !tofrom || tofrom == "from" ? colorspace.from : "";

        const returner =
            (isRgb || tofrom ? "" : "_a = alpha;") +
            "return vec4(_r,_g,_b,_a);";

        const glsl =
            rgbaDeclarations +
            rgbaAssignments +
            elemDeclarations +
            to +
            elemAssignments +
            from +
            returner;

        return { name: name, type: type, inputs: inputs, glsl: glsl };
    };

    hcs.generateColorFunction = (cs) =>
        hcs.generateFunction({
            colorspace: cs,
            sufix: "color",
            type: "color",
            assignmentFormat: "#el *= #in;",
            inputDefault: 1,
            alphaDefault: 1,
        });
    hcs.generateOffsetFunction = (cs) =>
        hcs.generateFunction({
            colorspace: cs,
            sufix: "offset",
            type: "color",
            assignmentFormat: "#el += #in;",
            inputDefault: 0,
            alphaDefault: 0,
        });
    hcs.generateSolidFunction = (cs) =>
        hcs.generateFunction({
            colorspace: cs,
            sufix: "solid",
            type: "src",
            assignmentFormat: "#el = #in;",
            inputDefault: 0,
            alphaDefault: 1,
        });
    hcs.generateToFunction = (cs) =>
        hcs.generateFunction({
            colorspace: cs,
            sufix: "to",
            type: "color",
            assignmentFormat: undefined,
            inputDefault: 0,
            alphaDefault: 1,
            tofrom: "to",
        });
    hcs.generateFromFunction = (cs) =>
        hcs.generateFunction({
            colorspace: cs,
            sufix: "from",
            type: "color",
            assignmentFormat: undefined,
            inputDefault: 0,
            alphaDefault: 1,
            tofrom: "from",
        });
    hcs.generateInvertFunction = (cs) =>
        hcs.generateFunction({
            colorspace: cs,
            sufix: "invert",
            type: "color",
            assignmentFormat: "#el = mix(#el, 1.0 - #el, #in);",
            inputDefault: 1,
            alphaDefault: 0,
        });

    // elem functions

    hcs.generateElementFunction = function (colorspace, elem) {
        const name = colorspace.name + "_" + elem;

        const type = "color";

        const rgbaDeclarations = hcs.generateDeclarations([
            "_r",
            "_g",
            "_b",
            "_a",
        ]);
        const rgbaAssignments =
            "_r = _c0.r; _g = _c0.g; _b = _c0.b; _a = _c0.a;";

        const elemDeclarations = hcs.generateDeclarations(colorspace.elems);
        const to = colorspace.to;

        const returner = "return vec4(vec3(" + elem + "),1.0);";

        const glsl =
            rgbaDeclarations +
            rgbaAssignments +
            elemDeclarations +
            to +
            returner;

        return { name: name, type: type, inputs: [], glsl: glsl };
    };

    hcs.generateElementFunctions = (cs) =>
        cs.elems.map((elem) => hcs.generateElementFunction(cs, elem));

    hcs.generateSetElementFunction = function ({
        colorspace,
        elem,
        sufix,
        assignmentFormat = "#el = #in;",
        inputDefault = 1,
    }) {
        const name = colorspace.name + "_" + elem + "_" + sufix;

        const type = "color";

        const inputs = [
            { type: "float", name: "in_" + elem, default: inputDefault },
        ];

        const rgbaDeclarations = hcs.generateDeclarations([
            "_r",
            "_g",
            "_b",
            "_a",
        ]);
        const rgbaAssignments =
            "_r = _c0.r; _g = _c0.g; _b = _c0.b; _a = _c0.a;";

        const elemDeclarations = hcs.generateDeclarations(colorspace.elems);
        const to = colorspace.to;
        const elemAssignment = hcs.generateInputAssignment(
            [elem],
            assignmentFormat
        );
        const from = colorspace.from;

        const returner = "return vec4(_r,_g,_b,_a);";

        const glsl =
            rgbaDeclarations +
            rgbaAssignments +
            elemDeclarations +
            to +
            elemAssignment +
            from +
            returner;

        return { name: name, type: type, inputs: inputs, glsl: glsl };
    };

    hcs.generateSetElementFunctions = (cs) =>
        cs.elems.map((elem) =>
            hcs.generateSetElementFunction({
                colorspace: cs,
                elem,
                sufix: "set",
                assignmentFormat: "#el = #in;",
            })
        );
    hcs.generateOffsetElementFunctions = (cs) =>
        cs.elems.map((elem) =>
            hcs.generateSetElementFunction({
                colorspace: cs,
                elem,
                sufix: "offset",
                assignmentFormat: "#el += #in;",
                inputDefault: 1,
            })
        );
    hcs.generateMultElementFunctions = (cs) =>
        cs.elems.map((elem) =>
            hcs.generateSetElementFunction({
                colorspace: cs,
                elem,
                sufix: "mult",
                assignmentFormat: "#el *= #in;",
                inputDefault: 1,
            })
        );
    hcs.generateInvertElementFunctions = (cs) =>
        cs.elems.map((elem) =>
            hcs.generateSetElementFunction({
                colorspace: cs,
                elem,
                sufix: "invert",
                assignmentFormat: "#el = mix(#el, 1.0 - #el, #in);",
                inputDefault: 1,
            })
        );

    hcs.generateCombineElementFunction = function ({
        colorspace,
        elem,
        sufix,
        assignmentFormat = "#el = _c1.r;",
        inputDefault = 1,
    }) {
        const name = colorspace.name + "_" + elem + "_" + sufix;

        const type = "combine";

        const inputs = [{ type: "float", name: "_amt", default: inputDefault }];

        const rgbaDeclarations = hcs.generateDeclarations([
            "_r",
            "_g",
            "_b",
            "_a",
        ]);
        const rgbaAssignments =
            "_r = _c0.r; _g = _c0.g; _b = _c0.b; _a = _c0.a;";

        const elemDeclarations = hcs.generateDeclarations(colorspace.elems);
        const to = colorspace.to;
        const elemAssignment = hcs.generateInputAssignment(
            [elem],
            assignmentFormat
        );
        const from = colorspace.from;

        const returner = "return vec4(_r,_g,_b,_a);";

        const glsl =
            rgbaDeclarations +
            rgbaAssignments +
            elemDeclarations +
            to +
            elemAssignment +
            from +
            returner;

        return { name: name, type: type, inputs: inputs, glsl: glsl };
    };

    hcs.generateSetElementFromFunctions = (cs) =>
        cs.elems.map((elem) =>
            hcs.generateCombineElementFunction({
                colorspace: cs,
                elem,
                sufix: "from",
                assignmentFormat: "#el = mix(#el,_c1.r,_amt);",
                inputDefault: 1,
            })
        );
    hcs.generateOffsetElementFromFunctions = (cs) =>
        cs.elems.map((elem) =>
            hcs.generateCombineElementFunction({
                colorspace: cs,
                elem,
                sufix: "offset_from",
                assignmentFormat: "#el += _c1.r*_amt;",
                inputDefault: 1,
            })
        );
    hcs.generateMultElementFromFunctions = (cs) =>
        cs.elems.map((elem) =>
            hcs.generateCombineElementFunction({
                colorspace: cs,
                elem,
                sufix: "mult_from",
                assignmentFormat: "#el *= _c1.r*_amt;",
                inputDefault: 1,
            })
        );

    // keying

    hcs.generateKeyingElementFunction = function ({ colorspace, elem }) {
        const name = colorspace.name + "_" + elem + "_" + "key";

        const type = "color";

        const inputs = [
            { type: "float", name: "_th0", default: 0.5 },
            { type: "float", name: "_t0", default: 0.05 },
            { type: "float", name: "_th1", default: 0 },
            { type: "float", name: "_t1", default: 0 },
        ];

        const isRgb = "rgba".includes(colorspace.name);
        const rgbaDeclarations = hcs.generateDeclarations([
            "_r",
            "_g",
            "_b",
            "_a",
        ]);
        const rgbaAssignments =
            "_r = _c0.r; _g = _c0.g; _b = _c0.b; _a = _c0.a;";

        const elemDeclarations = hcs.generateDeclarations(colorspace.elems);
        const to = colorspace.to;
        const keying = (
            "float _key = smoothstep(_th0-(_t0+0.0000001), _th0+(_t0+0.0000001), #elem);" +
            "_th1 = 1.0 - _th1 + 0.0000001; _key *= smoothstep(_th1-(-_t1-0.0000001), _th1+(-_t1-0.0000001), #elem);" +
            (isRgb ? "a" : "_a") +
            " *= _key;"
        ).replaceAll("#elem", elem);
        const from = colorspace.from;

        const returner = "return vec4(_r,_g,_b,_a);";

        const glsl =
            rgbaDeclarations +
            rgbaAssignments +
            elemDeclarations +
            to +
            keying +
            from +
            returner;

        return { name: name, type: type, inputs: inputs, glsl: glsl };
    };

    hcs.generateKeyingElementFunctions = (cs) =>
        cs.elems.map((elem) =>
            hcs.generateKeyingElementFunction({
                colorspace: cs,
                elem,
            })
        );

    // updaters

    hcs.updateFunctions = function () {
        []
            .concat(
                hcs.colorspaces.map(hcs.generateColorFunction),
                hcs.colorspaces.map(hcs.generateOffsetFunction),
                hcs.colorspaces.map(hcs.generateSolidFunction),
                hcs.colorspaces.map(hcs.generateToFunction),
                hcs.colorspaces.map(hcs.generateFromFunction),
                hcs.colorspaces.map(hcs.generateInvertFunction),
                hcs.colorspaces.map(hcs.generateElementFunctions),
                hcs.colorspaces.map(hcs.generateSetElementFunctions),
                hcs.colorspaces.map(hcs.generateOffsetElementFunctions),
                hcs.colorspaces.map(hcs.generateMultElementFunctions),
                hcs.colorspaces.map(hcs.generateInvertElementFunctions),
                hcs.colorspaces.map(hcs.generateSetElementFromFunctions),
                hcs.colorspaces.map(hcs.generateOffsetElementFromFunctions),
                hcs.colorspaces.map(hcs.generateMultElementFromFunctions),
                hcs.colorspaces.map(hcs.generateKeyingElementFunctions)
            )
            .flat(99)
            .filter((x) => x)
            .forEach((x) => _hydra.synth.setFunction(x));
    };

    hcs.cloneGlslSource = function (_tex) {
        const tex = Object.assign({}, _tex);
        Object.setPrototypeOf(tex, gS);
        tex.transforms = Array.from(_tex.transforms);
        return tex;
    };

    hcs.updateWithFunctions = function () {
        hcs.colorspaces.forEach((cs) => {
            cs.elems.forEach((el) => {
                gS[cs.name + "_" + el + "_" + "with"] = function (f) {
                    const tex = hcs.cloneGlslSource(this);
                    return this[cs.name + "_" + el + "_" + "from"](
                        f(tex)[cs.name + "_" + el]()
                    );
                };
            });
        });
    };

    hcs.update = function () {
        hcs.updateFunctions();
        hcs.updateWithFunctions();
        hcs.colorspaces.forEach((cs) => {
            let getterDefinition =
                "Object.defineProperty(gS, '#cs', { configurable: true, get: function() {" +
                "const func = this.#cs_color.bind(this);";
            getterDefinition +=
                "const props = {" +
                "color: this.#cs_color.bind(this)," +
                "offset: this.#cs_offset.bind(this)," +
                "to: this.#cs_to.bind(this)," +
                "from: this.#cs_from.bind(this)," +
                "invert: this.#cs_invert.bind(this),";
            cs.elems.forEach((elem) => {
                getterDefinition +=
                    "#elem: this.#cs_#elem.bind(this)," +
                    "#elemSet: this.#cs_#elem_set.bind(this)," +
                    "#elemOffset: this.#cs_#elem_offset.bind(this)," +
                    "#elemMult: this.#cs_#elem_mult.bind(this)," +
                    "#elemInvert: this.#cs_#elem_invert.bind(this)," +
                    "#elemFrom: this.#cs_#elem_from.bind(this)," +
                    "#elemOffsetFrom: this.#cs_#elem_offset_from.bind(this)," +
                    "#elemMultFrom: this.#cs_#elem_mult_from.bind(this)," +
                    "#elemKey: this.#cs_#elem_key.bind(this)," +
                    "#elemWith: this.#cs_#elem_with.bind(this),";
                getterDefinition = getterDefinition.replaceAll("#elem", elem);
            });
            getterDefinition += "};";
            getterDefinition +=
                "Object.assign(func,props);" + "return func; }, });";
            getterDefinition += "_hydraScope.#cs = _hydraScope.#cs_solid;";
            getterDefinition = getterDefinition.replaceAll("#cs", cs.name);
            window.eval(getterDefinition);
        });
    };

    hcs.update();

    window.hydraColorspaces = {};
    hydraColorspaces.colorspaces = hcs.colorspaces;
    hydraColorspaces.update = hcs.update.bind(hcs);
}
