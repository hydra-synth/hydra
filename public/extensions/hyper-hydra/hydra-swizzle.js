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
    // https://stackoverflow.com/questions/34127294/
    function getSwizzles(coords) {
        function combinations(input, length, curstr) {
            if (curstr.length == length) return [curstr];
            var ret = [];
            for (var i = 0; i < input.length; i++) {
                ret.push.apply(
                    ret,
                    combinations(input, length, curstr + input[i])
                );
            }
            return ret;
        }

        let ret = combinations(coords, coords.length, "");
        ret.splice(ret.indexOf("input"), 1);
        return ret;
    }
    const threeComponents = [].concat(getSwizzles("rgb"), getSwizzles("xyz"));

    const fourComponents = [].concat(getSwizzles("rgba"), getSwizzles("xyzw"));

    function definePropertyFromMethod(method, newName = "") {
        newName = newName ? newName : method;
        Object.defineProperty(gS, newName, {
            configurable: true,
            get() {
                return this[method].bind(this)();
            },
        });
    }

    function returnSwizzleKeepingAlpha(swizzle){
        const containsAny = (str, chars) => [...chars].some(char => str.includes(char));
        const alpha = containsAny(swizzle, "rgb") ? "a" : "w";
        return `return _c0.${swizzle + alpha};`;
    }

    threeComponents.forEach((swizzle) => {
        const name = "_" + swizzle;
        _hydra.synth.setFunction({
            name,
            type: "color",
            inputs: [],
            glsl: returnSwizzleKeepingAlpha(swizzle),
        });
        definePropertyFromMethod(name, swizzle);
    });
    fourComponents.forEach((swizzle) => {
        const name = "_" + swizzle;
        _hydra.synth.setFunction({
            name,
            type: "color",
            inputs: [],
            glsl: `return _c0.${swizzle};`,
        });
        definePropertyFromMethod(name, swizzle);
    });
    Array.from("rgbaxyzw").forEach((elem) => {
        const name = "_swizzle_" + elem;
        _hydra.synth.setFunction({
            name,
            type: "color",
            inputs: [],
            glsl: returnSwizzleKeepingAlpha(elem.repeat(3)),
        });
        definePropertyFromMethod(name, elem);
    });
}
