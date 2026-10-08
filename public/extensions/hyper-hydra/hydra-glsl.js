//hydra-gsls
//code glsl on the fly inside Hydra code

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
    const _glslExtension = {
        inputArray: () =>
            new Array(10)
                .fill("i")
                .map((x, i) => ({ name: x + i, type: "float", default: 1 })),
        nodeCount: 0,
        checkCode: function (code) {
            code = code.trim();
            let lines = code.split(";");
            let ll = lines.length - 1;
            if (!lines[ll]) {
                lines.pop();
                ll--;
            }
            lines[ll] = lines[ll].trim();
            lines[ll] =
                "\n" +
                (lines[ll].substring(0, 6) != "return"
                    ? "return " + lines[ll]
                    : lines[ll]) +
                ";";
            code = lines.join(";");
            return code;
        },
        getObjAndArgs: function (type, args) {
            let inputArray = false;
            if (args[0] instanceof Array && args[0][0].constructor === String) {
                inputArray = this.inputArray().map((x, i) => {
                    x.name = args[i] ? args[i][0] : x.name;
                    return x;
                });
                inputArray = inputArray.slice(0, args.length);
                args = args.map((x) => x[1]);
            }
            let obj = {
                name: "_glsl_ext_NODE_" + this.nodeCount,
                type: type,
                inputs: inputArray || this.inputArray(),
            };
            this.nodeCount++;
            return [obj, args];
        },
        glslSource: function (code, ...args) {
            let prefix = [
                !code.includes("vec2 uv") ? "vec2 uv = _st;\n" : "",
                !code.includes("vec2 st") ? "vec2 st = _st;\n" : "",
                !code.includes("vec2 xy") ? "vec2 xy = _st;\n" : "",
            ].join("");
            let data = this.getObjAndArgs("src", args);
            let obj = data[0];
            args = data[1];
            obj.glsl = prefix + this.checkCode(code);
            _hydra.synth.setFunction(obj);
            return globalThis[obj.name](...args);
        },
        glslColor: function (self, code, ...args) {
            let prefix = [
                !code.includes("vec4 c0") ? "vec4 c0 = _c0;\n" : "",
                !code.includes("vec4 color") ? "vec4 color = _c0;\n" : "",
            ].join("");
            let data = this.getObjAndArgs("color", args);
            let obj = data[0];
            args = data[1];
            obj.glsl = prefix + this.checkCode(code);
            _hydra.synth.setFunction(obj);
            return gS[obj.name].bind(self)(...args);
        },
        glslHsv: function (self, code, ...args) {
            code = "vec3 hsv = _rgbToHsv(c0.rgb);\n" + code;
            code = code + "\nreturn vec4(_hsvToRgb(hsv),c0.a);";
            return this.glslColor(self, code, ...args);
        },
        glslCoord: function (self, code, ...args) {
            let prefix = [
                !code.includes("vec2 uv") ? "vec2 uv = _st;\n" : "",
                !code.includes("vec2 st") ? "vec2 st = _st;\n" : "",
                !code.includes("vec2 xy") ? "vec2 xy = _st;\n" : "",
            ].join("");
            let data = this.getObjAndArgs("coord", args);
            let obj = data[0];
            args = data[1];
            obj.glsl = prefix + this.checkCode(code);
            _hydra.synth.setFunction(obj);
            return gS[obj.name].bind(self)(...args);
        },
        glslCombine: function (self, code, texture, ...args) {
            let prefix = [
                !code.includes("vec4 c0") ? "vec4 c0 = _c0;\n" : "",
                !code.includes("vec4 color0") ? "vec4 color0 = _c0;\n" : "",
                !code.includes("vec4 c1") ? "vec4 c1 = _c1;\n" : "",
                !code.includes("vec4 color1") ? "vec4 color1 = _c1;\n" : "",
            ].join("");
            let data = this.getObjAndArgs("combine", args);
            let obj = data[0];
            args = data[1];
            args.unshift(texture);
            obj.glsl = prefix + this.checkCode(code);
            _hydra.synth.setFunction(obj);
            return gS[obj.name].bind(self)(...args);
        },
        glslCombineCoord: function (self, code, texture, ...args) {
            let prefix = [
                !code.includes("vec4 c0") ? "vec4 c0 = _c0;\n" : "",
                !code.includes("vec4 color") ? "vec4 color = _c0;\n" : "",
                !code.includes("vec2 uv") ? "vec2 uv = _st;\n" : "",
                !code.includes("vec2 st") ? "vec2 st = _st;\n" : "",
                !code.includes("vec2 xy") ? "vec2 xy = _st;\n" : "",
            ].join("");
            let data = this.getObjAndArgs("combineCoord", args);
            let obj = data[0];
            args = data[1];
            args.unshift(texture);
            obj.glsl = prefix + this.checkCode(code);
            _hydra.synth.setFunction(obj);
            return gS[obj.name].bind(self)(...args);
        },
    };

    _hydraScope.glsl = _glslExtension.glslSource.bind(_glslExtension);
    gS.glslColor = function (code, ...args) {
        return _glslExtension.glslColor(this, code, ...args);
    };
    gS.glslHsv = function (code, ...args) {
        return _glslExtension.glslHsv(this, code, ...args);
    };
    gS.glslCoord = function (code, ...args) {
        return _glslExtension.glslCoord(this, code, ...args);
    };
    gS.glslCombine = function (code, texture, ...args) {
        return _glslExtension.glslCombine(this, code, texture, ...args);
    };
    gS.glslBlend = gS.glslCombine;
    gS.glslCombineCoord = function (code, texture, ...args) {
        return _glslExtension.glslCombineCoord(this, code, texture, ...args);
    };
    gS.glslModulate = gS.glslCombineCoord;
}
