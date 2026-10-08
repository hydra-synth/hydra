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
    function filterVecArgs(args) {
        let pass = [];
        args.forEach((arg) => {
            if (typeof arg == "number" || typeof arg == "function")
                pass = pass.concat(arg);
            else if (arg.constructor.name == "Array") {
                if (arg._vec) pass = pass.concat(arg);
                else pass = pass.concat([arg]);
            }
        });
        return pass;
    }
    window.vec4 = function (...args) {
        args = filterVecArgs(args);
        if (args.length == 1) {
            const arg = args[0];
            return solid(arg, arg, arg, arg);
        } else if (args.length == 4) {
            return _hydraScope.solid(...args);
        } else {
            throw new Error("vec4 should receive 4 elements");
        }
    };
    window.vec3 = function (...args) {
        args = filterVecArgs(args);
        if (args.length == 1) {
            const arg = args[0];
            let ret = Array.from({ length: 3 }, () => arg);
            ret._vec = true;
            return ret;
        } else if (args.length == 3) {
            args._vec = true;
            return args;
        } else {
            throw new Error("vec3 should receive 3 elements");
        }
    };
    window.vec2 = function (...args) {
        args = filterVecArgs(args);
        if (args.length == 1) {
            const arg = args[0];
            let ret = Array.from({ length: 2 }, () => arg);
            ret._vec = true;
            return ret;
        } else if (args.length == 2) {
            args._vec = true;
            return args;
        } else {
            throw new Error("vec2 should receive 2 elements");
        }
    };
}
