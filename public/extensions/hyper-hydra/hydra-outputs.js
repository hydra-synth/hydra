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
    const gl = _hydra.regl._gl;

    // Maps for regl-style option names to WebGL constants
    const filterMap = { nearest: gl.NEAREST, linear: gl.LINEAR };
    const wrapMap = { repeat: gl.REPEAT, clamp: gl.CLAMP_TO_EDGE, mirror: gl.MIRRORED_REPEAT };

    // Update texture parameters on an existing framebuffer without recreating it
    const updateFboTextureParams = (fb, params) => {
        const savedFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        const savedTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);

        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        const attachedTexture = gl.getFramebufferAttachmentParameter(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME
        );

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, attachedTexture);

        for (const [pname, value] of Object.entries(params)) {
            gl.texParameteri(gl.TEXTURE_2D, pname, value);
        }

        gl.bindTexture(gl.TEXTURE_2D, savedTexture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, savedFBO);
    };

    // Apply params to both ping-pong fbos of an output
    const updateOutputTextureParams = (output, params) => {
        output.fbos.forEach((fbo) => {
            updateFboTextureParams(fbo._framebuffer.framebuffer, params);
        });
    };

    // Clear a framebuffer to transparent black
    const clearFramebuffer = (fb) => {
        const savedFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, savedFBO);
    };

    // Clear both ping-pong fbos of an output
    const clearOutput = (output) => {
        output.fbos.forEach((fbo) => {
            clearFramebuffer(fbo._framebuffer.framebuffer);
        });
    };

    // Create an additional framebuffer matching existing output settings
    const createBuffer = (output) => {
        const refFbo = output.fbos[0];
        return output.regl.framebuffer({
            color: output.regl.texture({
                width: refFbo.width,
                height: refFbo.height,
                mag: "nearest",
                min: "nearest",
            }),
            depthStencil: false,
        });
    };

    // Initialize a buffer by copying content from another
    const initBufferFrom = (output, targetFbo, sourceFbo) => {
        output.regl({
            frag: `
                precision mediump float;
                varying vec2 uv;
                uniform sampler2D prevBuffer;
                void main() {
                    gl_FragColor = texture2D(prevBuffer, uv);
                }
            `,
            vert: output.vert,
            attributes: output.attributes,
            uniforms: { prevBuffer: sourceFbo.color[0] },
            count: 3,
            framebuffer: targetFbo,
        })();
    };

    // Override render to cycle through N buffers
    const createMultiBufferRender = () => {
        return function (passes) {
            const pass = passes[0];
            const self = this;

            const uniforms = Object.assign(pass.uniforms, {
                prevBuffer: () => self.fbos[self._readIndex],
            });

            self.draw = self.regl({
                frag: pass.frag,
                vert: self.vert,
                attributes: self.attributes,
                uniforms: uniforms,
                count: 3,
                framebuffer: () => {
                    const targetFBO = self.fbos[self._writeIndex];
                    self._readIndex = self._writeIndex;
                    self._writeIndex = (self._writeIndex + 1) % self.fbos.length;
                    return targetFBO;
                },
            });
        };
    };

    const oP = _hydra.o[0].constructor.prototype;

    oP.setNearest = function () {
        updateOutputTextureParams(this, {
            [gl.TEXTURE_MIN_FILTER]: gl.NEAREST,
            [gl.TEXTURE_MAG_FILTER]: gl.NEAREST,
        });
    };
    oP.setLinear = function () {
        updateOutputTextureParams(this, {
            [gl.TEXTURE_MIN_FILTER]: gl.LINEAR,
            [gl.TEXTURE_MAG_FILTER]: gl.LINEAR,
        });
    };
    oP.setRepeat = function () {
        updateOutputTextureParams(this, {
            [gl.TEXTURE_WRAP_S]: gl.REPEAT,
            [gl.TEXTURE_WRAP_T]: gl.REPEAT,
        });
    };
    oP.setClamp = function () {
        updateOutputTextureParams(this, {
            [gl.TEXTURE_WRAP_S]: gl.CLAMP_TO_EDGE,
            [gl.TEXTURE_WRAP_T]: gl.CLAMP_TO_EDGE,
        });
    };
    oP.setMirror = function () {
        updateOutputTextureParams(this, {
            [gl.TEXTURE_WRAP_S]: gl.MIRRORED_REPEAT,
            [gl.TEXTURE_WRAP_T]: gl.MIRRORED_REPEAT,
        });
    };
    oP.clear = function () {
        clearOutput(this);
    };

    // Set the number of framebuffers (minimum 2)
    oP.setBufferCount = function (count) {
        const n = Math.max(2, Math.floor(count));
        const current = this.fbos.length;

        if (n === current) return;

        if (n > current) {
            // Add buffers
            for (let i = current; i < n; i++) {
                const newFbo = createBuffer(this);
                initBufferFrom(this, newFbo, this.fbos[0]);
                this.fbos.push(newFbo);
            }
        } else {
            // Remove buffers (destroy extra ones)
            while (this.fbos.length > n) {
                const removed = this.fbos.pop();
                removed.destroy();
            }
        }

        // Use multi-buffer render if >2, otherwise restore prototype method
        if (n > 2) {
            this._readIndex = 0;
            this._writeIndex = 1;
            this.render = createMultiBufferRender();
        } else {
            delete this.render;
            delete this._readIndex;
            delete this._writeIndex;
        }
    };

    // Reset to default 2 buffers with nearest/clamp
    oP.resetBuffers = function () {
        this.setBufferCount(2);
        this.setNearest();
        this.setClamp();
    };

    // regl-style compatible
    oP.setFbos = function (opts0, opts1) {
        const settings = opts1 ? [opts0, opts1] : [opts0, opts0];
        this.fbos.forEach((fbo, i) => {
            const opts = settings[i] || {};
            const params = {};
            if (opts.min) params[gl.TEXTURE_MIN_FILTER] = filterMap[opts.min];
            if (opts.mag) params[gl.TEXTURE_MAG_FILTER] = filterMap[opts.mag];
            if (opts.wrapS) params[gl.TEXTURE_WRAP_S] = wrapMap[opts.wrapS];
            if (opts.wrapT) params[gl.TEXTURE_WRAP_T] = wrapMap[opts.wrapT];
            if (Object.keys(params).length) {
                updateFboTextureParams(fbo._framebuffer.framebuffer, params);
            }
        });
    };

    _hydraScope.oS = { outputs: window._hydra.o };
    _hydraScope.oS.setNearest = function () {
        this.outputs.forEach((x) => x.setNearest());
    };
    _hydraScope.oS.setLinear = function () {
        this.outputs.forEach((x) => x.setLinear());
    };
    _hydraScope.oS.setRepeat = function () {
        this.outputs.forEach((x) => x.setRepeat());
    };
    _hydraScope.oS.setClamp = function () {
        this.outputs.forEach((x) => x.setClamp());
    };
    _hydraScope.oS.setMirror = function () {
        this.outputs.forEach((x) => x.setMirror());
    };
    _hydraScope.oS.clear = function () {
        this.outputs.forEach((x) => x.clear());
    };
    _hydraScope.oS.setBufferCount = function (count) {
        this.outputs.forEach((x) => x.setBufferCount(count));
    };
    _hydraScope.oS.resetBuffers = function () {
        this.outputs.forEach((x) => x.resetBuffers());
    };
    _hydraScope.oS.setFbos = function (opts0, opts1) {
        this.outputs.forEach((x) => x.setFbos(opts0, opts1));
    };
}
