// https://github.com/bahamas10/node-bpm/blob/master/bpm.js
if (typeof exports !== 'undefined') {
    module.exports = BPM;
    module.exports.BPM = BPM;
}
function BPM() {
    this.count = 0;
    this.ts = 0;
    this.old_ts = 0;
}
BPM.prototype.tap = function () {
    this.ts = Date.now();
    if (!this.first_ts) this.first_ts = this.ts;
    var ret = {};
    // ignore the first tap
    if (this.old_ts) {
        var ms = this.ts - this.old_ts;
        var avg = 60000 * this.count / (this.ts - this.first_ts);
        ret.avg = avg;
        ret.ms = ms;
    }
    ret.count = ++this.count;
    // Store the old timestamp
    this.old_ts = this.ts;
    return ret;
};
BPM.prototype.reset = function () {
    this.count = 0;
    this.ts = 0;
    this.old_ts = 0;
    this.first_ts = 0;
};
window.BPM = BPM;

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
    const tapper = new BPM();
    window.hydraTap = {};
    hydraTap.resyncCall = () => 0;
    let resetInterval = 0;

    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.keyCode === 32 && !(event.shiftKey)) {
            clearInterval(resetInterval);
            const tap = tapper.tap();
            if (tap.count > 1) {
                _hydra.sandbox.set('bpm', Math.round(tap.avg));
            }
            resetInterval = setInterval(tapper.reset.bind(tapper), 1500);
        } else if (event.ctrlKey && event.key === ",") {
            _hydra.sandbox.set('time', hydraTap.resyncCall());
        }
    });

    function setRange(f) {
        f.range = (min = 0, max = 1) => () => f() * (max - min) + min;
        return f;
    }
    function setCurve(f) {
        f.curve = (q = 1) => {
            f2 = () => q > 0 ? Math.pow(f(), q) : (1 - Math.pow(1 - f(), -q));
            f2 = setRange(f2);
            return f2;
        };
        return f;
    }
    function rampToFunction(ramp) {
        ramp = setRange(ramp);
        ramp = setCurve(ramp);
        return ramp;
    }

    const rampUp = (x) => ((time * (1 / x)) % (60 / bpm)) / (60 / bpm);
    const rampDown = (x) => ((60 / bpm) - ((time * (1 / x)) % (60 / bpm))) / (60 / bpm);
    const rampTriUp = (x) => ((time * (1 / x)) % (60 * 2 / bpm)) >= (60 / bpm) ? rampUp(x) : rampDown(x);
    const rampTriDown = (x) => ((time * (1 / x)) % (60 * 2 / bpm)) >= (60 / bpm) ? rampDown(x) : rampUp(x);

    window.beats_ = (n = 1) => rampToFunction(() => rampUp(n))
    window.beats = (n = 1) => rampToFunction(() => rampDown(n))
    window.beatsTri_ = (n = 1) => rampToFunction(() => rampTriUp(n))
    window.beatsTri = (n = 1) => rampToFunction(() => rampTriDown(n))

    // speed controls

    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.shiftKey && event.altKey && event.code.startsWith('Digit')) {
            const number = parseInt(event.code.charAt(event.code.length - 1));
            const negativeSpeed = -number;
            _hydra.sandbox.set('speed', negativeSpeed);
        } else if (event.ctrlKey && event.shiftKey && event.code.startsWith('Digit')) {
            const number = parseInt(event.code.charAt(event.code.length - 1));
            _hydra.sandbox.set('speed', number);
        } else if (event.ctrlKey && event.altKey && event.code.startsWith('Digit')) {
            const number = parseInt(event.code.charAt(event.code.length - 1));
            const speed = 1 / number;
            _hydra.sandbox.set('speed', speed);
        }
    });    

    let previousSpeed = _hydra.synth.speed;
    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.shiftKey && event.keyCode === 32) {
            if (_hydra.synth.speed !== 0) {
                previousSpeed = _hydra.synth.speed;
                _hydra.sandbox.set('speed', 0);
            } else {
                _hydra.sandbox.set('speed', previousSpeed);
            }
        }
    });

}
