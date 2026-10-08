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
  
  _hydra.synth.setFunction({
    name: "lookupX",
    type: "color",
    inputs: [
      {
        name: "_tex",
        type: "sampler2D",
        default: o0,
      },
      {
        name: "yOffset",
        type: "float",
        default: 0,
      },
      {
        name: "blending",
        type: "float",
        default: 1,
      },
    ],
    glsl: `
          float lum = _luminance(_c0.rgb);
          vec2 pos = vec2(lum,yOffset);
          vec4 color = texture2D(_tex,pos);
          return mix(_c0,color,blending);
      `,
  });
  
  _hydra.synth.setFunction({
    name: "lookupY",
    type: "color",
    inputs: [
      {
        name: "_tex",
        type: "sampler2D",
        default: o0,
      },
      {
        name: "xOffset",
        type: "float",
        default: 0,
      },
      {
        name: "blending",
        type: "float",
        default: 1,
      },
    ],
    glsl: `
            float lum = _luminance(_c0.rgb);
          vec2 pos = vec2(xOffset,lum);
          vec4 color = texture2D(_tex,pos);
          return mix(_c0,color,blending);
      `,
  });
  
  {
    const hydraGradients = {};
    hydraGradients.resolution = 512;
    
    function createSource() {
      const { constructor: HydraSource, regl, pb, width, height } = _hydra.s[0];
      return new HydraSource({ regl, pb, width, height });
    }
  
    window.createLinearGradient = function(angle,...args) {
      const cssColorFrom = (color) => {
        const alpha = color.pop();
        const cssColor = `rgba(${color
          .map((cur) => Math.round(cur * 256))
          .join(" ")}/ ${alpha})`;
        return cssColor;
      };
  
      const normalizeArrayColor = (color) => {
        if (Array.isArray(color)) {
          return cssColorFrom(
            Array.from({ length: 4 }).map((_, i) => color[i] ?? Number(i === 3))
          );
        } else {
          return color;
        }
      };
  
      const generateSteps = (q) =>
        Array.from({ length: q }, (_, i) => i / (q - 1));
      
      const generateBounds = (angle) => {
        const radius = hydraGradients.resolution / 2;
        const [s, c] = [Math.sin(angle), Math.cos(angle)];
        const startX = radius - (c * radius);
        const startY = radius - (s * radius);
        const endX = radius + (c * radius);
        const endY = radius + (s * radius);
        return [startX, startY, endX, endY];
      }
      const bounds = generateBounds(angle);
      const canvas = document.createElement("canvas");
      canvas.width = hydraGradients.resolution;
      canvas.height = hydraGradients.resolution;
      const ctx = canvas.getContext("2d");
  
      const hasCustomSteps = Number.isFinite(args[1]);
      if (hasCustomSteps && args.length % 2 !== 0) args.push(1);
  
      const filterEvery = hasCustomSteps ? 2 : 1;
      let [colors, steps] = [
        args.filter((_, i) => i % filterEvery ^ 1).map(normalizeArrayColor),
        args.filter((_, i) => i % filterEvery),
      ];
      steps = steps.length ? steps : generateSteps(colors.length);
      const gradient = ctx.createLinearGradient(...bounds);
      colors.forEach((color, i) => gradient.addColorStop(steps[i], color));
  
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      const source = createSource();
      source.init({ src: canvas }, { min: "linear", mag: "linear" });
  
      return source;
    }
    
    window.createGradient = (...args) => window.createLinearGradient(0,...args);
  }
  