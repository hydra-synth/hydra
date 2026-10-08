// hydra-abbreviations
// diminutives for all the functions

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

    gS.bl = gS.blend;
    gS.bright = gS.brightness;
    gS.br = gS.brightness;
    gS.clr = gS.color;
    gS.c = gS.color;
    gS.clrm = gS.colorama;
    gS.cm = gS.colorama;
    gS.cntrst = gS.contrast;
    gS.ct = gS.contrast;
    gS.df = gS.diff;
    gS.invrt = gS.invert;
    gS.inv = gS.invert;
    gS.i = gS.invert;
    gS.kld = gS.kaleid;
    gS.k = gS.kaleid;
    gS.lyr = gS.layer;
    gS.ly = gS.layer;
    gS.lr = gS.layer;
    gS.l = gS.layer;
    gS.lm = gS.luma;
    gS.msk = gS.mask;
    gS.mod = gS.modulate;
    gS.m = gS.modulate;
    gS.modh = gS.modulateHue;
    gS.mh = gS.modulateHue;
    gS.mH = gS.modulateHue;
    gS.modk = gS.modulateKaleid;
    gS.mk = gS.modulateKaleid;
    gS.mK = gS.modulateKaleid;
    gS.modp = gS.modulatePixelate;
    gS.mp = gS.modulatePixelate;
    gS.mP = gS.modulatePixelate;
    gS.modrp = gS.modulateRepeat;
    gS.mrp = gS.modulateRepeat;
    gS.mRp = gS.modulateRepeat;
    gS.modrpx = gS.modulateRepeatX;
    gS.mrpx = gS.modulateRepeatX;
    gS.mRpx = gS.modulateRepeatX;
    gS.mRpX = gS.modulateRepeatX;
    gS.modrpy = gS.modulateRepeatY;
    gS.mrpy = gS.modulateRepeatY;
    gS.mRpy = gS.modulateRepeatY;
    gS.mRpY = gS.modulateRepeatY;
    gS.modr = gS.modulateRotate;
    gS.mr = gS.modulateRotate;
    gS.mR = gS.modulateRotate;
    gS.modrt = gS.modulateRotate;
    gS.mrt = gS.modulateRotate;
    gS.mRt = gS.modulateRotate;
    gS.modrot = gS.modulateRotate;
    gS.mrot = gS.modulateRotate;
    gS.mRot = gS.modulateRotate;
    gS.mods = gS.modulateScale;
    gS.ms = gS.modulateScale;
    gS.mS = gS.modulateScale;
    gS.modx = gS.modulateScrollX;
    gS.mx = gS.modulateScrollX;
    gS.mX = gS.modulateScrollX;
    gS.mody = gS.modulateScrollY;
    gS.my = gS.modulateScrollY;
    gS.mY = gS.modulateScrollY;
    gS.mlt = gS.mult;
    gS.ml = gS.mult;
    gS.mt = gS.mult;
    gS.pxlt = gS.pixelate;
    gS.px = gS.pixelate;
    gS.p = gS.pixelate;
    gS.pstr = gS.posterize;
    gS.ps = gS.posterize;
    gS.rpt = gS.repeat;
    gS.rp = gS.repeat;
    gS.rptx = gS.repeatX;
    gS.rpx = gS.repeatX;
    gS.rptX = gS.repeatX;
    gS.rpX = gS.repeatX;
    gS.rpty = gS.repeatY;
    gS.rpy = gS.repeatY;
    gS.rptY = gS.repeatY;
    gS.rpY = gS.repeatY;
    gS.rot = gS.rotate;
    gS.rt = gS.rotate;
    gS.strt = gS.saturate;
    gS.st = gS.saturate;
    gS.s = gS.scale;
    gS.sc = gS.scale;
    gS.scrll = gS.scroll;
    gS.xy = gS.scroll;
    gS.x = gS.scrollX;
    gS.y = gS.scrollY;
    gS.shft = gS.shift;
    gS.sh = gS.shift;
    gS.sb = gS.sub;
    gS.sm = gS.sum;
    gS.thrsh = gS.thresh;
    gS.thr = gS.thresh;
    gS.th = gS.thresh;
    gS.t = gS.thresh;

    gS.__proto__.o = gS.__proto__.out;

    _hydraScope.n = noise;
    _hydraScope.ns = noise;
    _hydraScope.vor = voronoi;
    _hydraScope.vr = voronoi;
    _hydraScope.v = voronoi;
    _hydraScope.shp = shape;
    _hydraScope.sh = shape;
    _hydraScope.grd = gradient;
    _hydraScope.gr = gradient;
    _hydraScope.gd = gradient;
    _hydraScope.s = solid;
    _hydraScope.sl = solid;
    _hydraScope.o = osc;

    // abbreviator
    // TODO: refactor this mess:

    window.Abbreviator = {
        abbreviations: {
            functions: {
                blend: "bl",
                bright: "br",
                color: "c",
                colorama: "cm",
                contrast: "ct",
                diff: "df",
                invert: "inv",
                kaleid: "k",
                layer: "l",
                luma: "lm",
                mask: "msk",
                modulate: "m",
                modulateHue: "mH",
                modulateKaleid: "mK",
                modulatePixelate: "mP",
                modulateRepeat: "mRp",
                modulateRepeatX: "mRpX",
                modulateRepeatY: "mRpY",
                modulateRotate: "mR",
                modulateScale: "mS",
                modulateScrollX: "mX",
                modulateScrollY: "mY",
                mult: "mlt",
                pixelate: "p",
                posterize: "ps",
                repeat: "rp",
                repeatX: "rpX",
                repeatY: "rpY",
                rotate: "rt",
                saturate: "st",
                scale: "sc",
                scroll: "xy",
                scrollX: "x",
                scrollY: "y",
                shift: "sh",
                sub: "sb",
                sum: "sm",
                thresh: "th",
            },
            sources: {
                noise: "ns",
                voronoi: "vr",
                shape: "sh",
                gradient: "grd",
                solid: "sl",
            },
        }, // here comes some ugly code:
        getKeyFromValue(object, value) {
            return Object.keys(object).find((key) => object[key] === value);
        },
        checkAndUnabbreviateSource(match, offset, string) {
            k = match.replace("(", "");
            replace =
                Abbreviator.getKeyFromValue(
                    Abbreviator.abbreviations.sources,
                    k
                ) + "(";
            if (offset == 0) return replace;
            pch = string[offset - 1];
            if ("\n\t;( ".includes(pch)) return replace;
            else return match;
        },
        checkAndUnabbreviateFunction(match, offset, string) {
            k = match.replace("(", "").replace(".", "");
            replace =
                "." +
                Abbreviator.getKeyFromValue(
                    Abbreviator.abbreviations.functions,
                    k
                ) +
                "(";
            if (offset == 0) return match;
            pch = string[offset - 1];
            if ("\n\t )".includes(pch)) return replace;
            else return match;
        },
        checkAndAbbreviateSource(match, offset, string) {
            k = match.replace("(", "");
            replace = Abbreviator.abbreviations.sources[k] + "(";
            if (offset == 0) return replace;
            pch = string[offset - 1];
            if ("\n\t;( ".includes(pch)) return replace;
            else return match;
        },
        checkAndAbbreviateFunction(match, offset, string) {
            k = match.replace("(", "").replace(".", "");
            replace = "." + Abbreviator.abbreviations.functions[k] + "(";
            if (offset == 0) return match;
            pch = string[offset - 1];
            if ("\n\t )".includes(pch)) return replace;
            else return match;
        },
        removeSpacing(code) {
            return code
                .replaceAll(" ", "")
                .replaceAll("\n", "")
                .replaceAll("\t", "");
        },
        abbreviate(code, noSpacing = false) {
            Object.keys(Abbreviator.abbreviations.functions).forEach((k) => {
                code = code.replaceAll(
                    "." + k + "(",
                    Abbreviator.checkAndAbbreviateFunction
                );
            });
            Object.keys(Abbreviator.abbreviations.sources).forEach((k) => {
                code = code.replaceAll(
                    k + "(",
                    Abbreviator.checkAndAbbreviateSource
                );
            });
            code = noSpacing ? Abbreviator.removeSpacing(code) : code;
            console.log(code);
            return code;
        },
        unabbreviate(code) {
            Object.keys(Abbreviator.abbreviations.sources).forEach((k) => {
                k = Abbreviator.abbreviations.sources[k];
                code = code.replaceAll(
                    k + "(",
                    Abbreviator.checkAndUnabbreviateSource
                );
            });
            Object.keys(Abbreviator.abbreviations.functions).forEach((k) => {
                k = Abbreviator.abbreviations.functions[k];
                code = code.replaceAll(
                    "." + k + "(",
                    Abbreviator.checkAndUnabbreviateFunction
                );
            });
            console.log(code);
            return code;
        },
    };
    window.abbreviate = Abbreviator.abbreviate.bind(Abbreviator);
    window.unabbreviate = Abbreviator.unabbreviate.bind(Abbreviator);
}
