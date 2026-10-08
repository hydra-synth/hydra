// Extensions bundled with the editor (vendored in public/extensions/ by
// scripts/vendor-extensions.sh). Each entry lists the names it adds so that a
// sketch can use them without an explicit loadScript() — see ./autoload.js.
//
// provides:
//   globals  - free functions / objects, e.g. blobs(), hydraText
//   methods  - functions chained on a hydra source, e.g. osc().screen(o1)
//   arrays   - methods on arrays, e.g. [0, 1].addWrap(...)
//   members  - properties of a known object; 'output' matches o0..o3 and
//              'source' matches s0..s3, any other key is a global name
// ready: optional check for extensions that finish setting up after their
// script has run
//
// When two extensions provide the same name, the one listed first wins.

const HYPER_HYDRA_CDN = 'https://cdn.jsdelivr.net/gh/geikha/hyper-hydra@latest/'
const HYPER_HYDRA_DOCS = 'https://github.com/geikha/hyper-hydra/blob/main/doc/'
const HYPER_HYDRA_README = 'https://github.com/geikha/hyper-hydra#'
const EXTRA_SHADERS_CDN = 'https://metagrowing.org/extra-shaders-for-hydra/'
const EXTRA_SHADERS_DOCS = 'https://gitlab.com/metagrowing/extra-shaders-for-hydra/-/blob/main/gallery/'

export const collections = [
  {
    id: 'hyper-hydra',
    name: 'hyper-hydra',
    author: 'geikha',
    homepage: 'https://github.com/geikha/hyper-hydra',
    license: 'GPL-3.0'
  },
  {
    id: 'extra-shaders',
    name: 'extra shaders',
    author: 'Thomas Jourdan',
    homepage: 'https://gitlab.com/metagrowing/extra-shaders-for-hydra',
    license: 'AGPL-3.0'
  }
]

// every combination of `chars` with length `chars.length`, e.g. rgb -> rrr, rrg, ... bbb
const swizzles = (chars) => {
  let result = ['']
  for (let i = 0; i < chars.length; i++) {
    result = result.flatMap((prefix) => Array.from(chars, (c) => prefix + c))
  }
  return result
}

const convolutionKernels = [
  'sharpen', 'sharpenMore', 'lineSharpen', 'emboss', 'blur', 'blur5', 'blur7', 'boxBlur',
  'boxBlur5', 'horizontalBlur', 'verticalBlur', 'diagonalBlur', 'diagonalBlur2', 'lineBlur',
  'lineBlur5', 'sobelY', 'sobelX', 'sobelDiagonal', 'sobelDiagonal2', 'prewittY', 'prewittX',
  'prewittDiagonal', 'prewittDiagonal2', 'edge'
]

const blendModes = [
  'add2', 'average', 'colorBurn', 'colorDodge', 'darken', 'difference', 'divide', 'exclusion',
  'glow', 'hardLight', 'hardMix', 'lighten', 'linearBurn', 'linearDodge', 'linearLight',
  'multiply', 'negation', 'overlay', 'phoenix', 'pinLight', 'reflect', 'screen', 'softLight',
  'subtract', 'vividLight'
]

const colorspaces = ['rgb', 'cmyk', 'hsv', 'hsl', 'yuv', 'yiq']

const hyperHydra = (name, { doc = true, thumbnail, ...rest }) => ({
  id: `hyper-hydra/${name}`,
  collection: 'hyper-hydra',
  name: `hydra-${name}`,
  author: 'geikha',
  file: `hyper-hydra/hydra-${name}.js`,
  url: `${HYPER_HYDRA_CDN}hydra-${name}.js`,
  documentation: doc ? `${HYPER_HYDRA_DOCS}hydra-${name}.md` : `${HYPER_HYDRA_README}hydra-${name}`,
  thumbnail: thumbnail ? `ritchse-hydra-${name}.png` : undefined,
  autoload: true,
  ...rest
})

const extraShaders = (lib, { gallery = lib, thumbnail = true, ...rest }) => ({
  id: `extra-shaders/${lib}`,
  collection: 'extra-shaders',
  author: 'Thomas Jourdan',
  file: `extra-shaders/lib-${lib}.js`,
  url: `${EXTRA_SHADERS_CDN}lib-${lib}.js`,
  documentation: gallery ? `${EXTRA_SHADERS_DOCS}${gallery}/README.md` : 'https://gitlab.com/metagrowing/extra-shaders-for-hydra',
  thumbnail: thumbnail ? `kandid-lib-${lib}.png` : undefined,
  autoload: true,
  ...rest
})

export const extensions = [
  hyperHydra('arithmetics', {
    thumbnail: true,
    description: 'Visual arithmetics: mod, step, pow, min, max, trigonometry, ranges and coordinate sources.',
    provides: {
      globals: ['x', 'y', 'length', 'distance', 'xCenter', 'yCenter', 'lengthCenter', 'distanceCenter'],
      methods: [
        'abs', 'sign', 'fract', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'exp', 'log', 'exp2',
        'log2', 'sqrt', 'inversesqrt', 'mod', 'min', 'max', 'step', 'pow', 'div', 'amp', 'amplitude',
        'offset', 'off', 'bipolar', 'unipolar', 'range', 'birange', 'clamp'
      ]
    },
    examples: [`osc(10,.1,2)
  .mod(gradient().asin().cos())
  .step(noise(2).unipolar().div(o0))
  .blend(o0,.2)
  .out()`]
  }),
  hyperHydra('arrays', {
    description: 'Operate between arrays and generate new ones: add, mult, wrap, shuffle, Array.run, Array.random...',
    provides: {
      arrays: [
        'add', 'sub', 'div', 'mult', 'mod', 'addWrap', 'subWrap', 'divWrap', 'multWrap', 'modWrap',
        'shuffle', 'zfill', 'rotate', 'rot'
      ],
      members: { Array: ['random', 'range', 'run'] }
    },
    examples: [`gradient().diff(o0)
  .hue([0,2,3,8].div(10).addWrap([0.2,0.1]).smooth())
  .rotate(Array.run(8).mult(Math.PI*2/8))
  .add(shape(64,.02)
    .scrollX(Array.random(16,-0.4,0.4).smooth())
    .scrollY(Array.random(16,-0.4,0.4).smooth()))
  .blend(o0,.6)
  .out()
bpm = 50`]
  }),
  hyperHydra('blend', {
    thumbnail: true,
    description: 'Blending modes from raster image software (screen, overlay, softLight...). Also redefines layer, mask and luma for better alpha handling.',
    provides: { methods: [...blendModes, 'premultiply', 'pm', 'negate'] },
    examples: [`osc(30)
  .screen(noise(3,1).pm())
  .linearBurn(gradient(1).hue(.3))
  .out()`]
  }),
  hyperHydra('canvas', {
    description: "Control hydra's canvas: size, alignment and pixel interpolation.",
    provides: { globals: ['canvas'] },
    examples: [`setResolution(256,256)
canvas.setRelativeSize(2)
canvas.setLinear()

solid(1).diff(o0).scale(.5).diff(noise(2,0.4)).out()`]
  }),
  hyperHydra('colorspaces', {
    description: 'Work with color in other colorspaces: CMYK, HSV, HSL, YUV, YIQ.',
    provides: { globals: [...colorspaces, 'hydraColorspaces'], methods: colorspaces },
    examples: [`gradient().rgb.aSet(0)
  .cmyk.from()
  .hsv.hOffsetFrom(noise(1,1),.3)
  .yuv(1,.5)
  .out()`]
  }),
  hyperHydra('convolutions', {
    description: 'Convolution kernels as sources: blur, sharpen, sobel, prewitt, edge... or define your own.',
    provides: {
      globals: [
        ...convolutionKernels.flatMap((k) => ['', 'Luma', 'OnY', 'OnUV', 'OnIQ'].map((v) => k + v)),
        'setConvolutionFunction'
      ]
    },
    examples: [`voronoi()
  .out(o1)

sharpenOnY(o1,2,4)
  .blend(blur(o0,2).scale(.9).contrast(1.1),.6)
  .out(o0)`]
  }),
  hyperHydra('debug', {
    description: 'Adds .debug() to read and live-edit the fragment shader of a sketch.',
    provides: { methods: ['debug'] },
    // defines .debug() only after fetching its own dependencies
    ready: () => 'debug' in Object.getPrototypeOf(window.osc()),
    examples: ['osc().rotate().debug(o0)']
  }),
  hyperHydra('fractals', {
    thumbnail: true,
    description: 'Mirroring and inversion functions that make fractals when fed back.',
    provides: { methods: ['mirrorX', 'mirrorY', 'mirrorX2', 'mirrorY2', 'mirrorWrap', 'inversion'] },
    examples: [`src(o0)
  .scale(.75)
  .add(noise(2,1),.4)
  .invert()
  .inversion()
  .mirrorX2()
  .blend(o0,.3)
  .out()`]
  }),
  hyperHydra('gif', {
    thumbnail: true,
    description: 'Load animated .gif files into a source with s0.initGif(url).',
    provides: { members: { source: ['initGif'] } },
    examples: [`s0.initGif('https://i.giphy.com/media/kZqbBT64ECtjy/giphy.gif')

src(s0)
  .out()`]
  }),
  hyperHydra('glsl', {
    description: 'Write GLSL code directly in your patches.',
    provides: {
      globals: ['glsl'],
      methods: ['glslColor', 'glslHsv', 'glslCoord', 'glslCombine', 'glslBlend', 'glslCombineCoord', 'glslModulate']
    },
    examples: [`glsl('vec4(sin(uv.x*i0+(time*i1*vec3(i2,i2*2.,i2*3.))),1.0)',16,2,.3)
  .glslColor('vec4(c0.brg-(sin(c0.b)*i0),1.)',()=>Math.cos(time))
  .out()`]
  }),
  hyperHydra('gradientmap', {
    doc: false,
    description: 'Create gradients from css colors and use them for gradient mapping.',
    provides: { globals: ['createGradient', 'createLinearGradient'], methods: ['lookupX', 'lookupY'] },
    examples: [`const myGradient = createGradient("#000", "#0bf", "red", "white");

osc(30,.05).kaleid(720).scale(1,()=>innerHeight/innerWidth)
  .lookupX(myGradient)
  .out()`]
  }),
  hyperHydra('mouse', {
    description: 'Replaces the mouse object, adding normalized and canvas-relative positions (mouse.posx, mouse.cposy...).',
    provides: { members: { mouse: ['ax', 'ay', 'cx', 'cy', 'rx', 'ry', 'crx', 'cry', 'posx', 'posy', 'cposx', 'cposy'] } },
    examples: [`noise(1)
  .add(shape(64,.01,.2).scrollX(()=>mouse.posx).scrollY(()=>mouse.posy))
  .out()`]
  }),
  hyperHydra('outputs', {
    thumbnail: true,
    description: "Change the framebuffer settings of outputs: linear interpolation, wrapping, buffer count.",
    provides: {
      globals: ['oS'],
      members: {
        output: ['setNearest', 'setLinear', 'setRepeat', 'setClamp', 'setMirror', 'clear', 'setBufferCount', 'resetBuffers', 'setFbos']
      }
    },
    examples: [`o1.setLinear()

src(o1)
  .layer(osc(30,.2,1).mask(shape(4,.1,0)))
  .scale(1.01).rotate(.01)
  .out(o1)

render(o1)`]
  }),
  hyperHydra('pip', {
    doc: false,
    description: 'Toggle picture-in-picture for the hydra canvas with hydraPip().',
    provides: { globals: ['hydraPip', 'hydraPictureInPicture'] },
    examples: [`osc(40,.09,1.5)
  .diff(osc(20).luma())
  .out()

// hydraPip()`]
  }),
  hyperHydra('pixels', {
    description: "Read pixel values from hydra's outputs with o0.read(x, y).",
    provides: { members: { output: ['read', 'readAll'] } },
    examples: [`pixel = [0,0,0,0]
osc(40,.09,1.5)
  .diff(osc(20).luma())
  .color(1,1,()=>1+pixel[0]/255)
  .out()

update = () => {
  pixel = o0.read(width/2,height/2)
}`]
  }),
  hyperHydra('src', {
    doc: false,
    description: 'srcAbs and srcRel show sources at their original size or aspect ratio.',
    provides: {
      globals: ['srcAbs', 'srcRel', 'srcMask', 'srcAbsMask', 'srcRelMask'],
      methods: ['rotateRel', 'correctScaleRel', 'noWrap']
    },
    examples: [`s0.initImage('https://upload.wikimedia.org/wikipedia/commons/2/25/Hydra-Foto.jpg')

src(o0)
  .scale(1.01)
  .colorama(-.02).brightness(-.2)
  .blend(o0,.8)
  .layer(srcAbs(s0).luma(.4,.1))
  .out()`]
  }),
  hyperHydra('swizzle', {
    description: 'GLSL-style swizzling: osc().gbr, gradient().r, noise().xxyw...',
    provides: { methods: [...swizzles('rgb'), ...swizzles('xyz'), ...swizzles('rgba'), ...swizzles('xyzw'), ...'rgbaxyzw'] },
    examples: [`gradient(1).gbg
  .layer(osc(30,.1,2).bggr)
  .layer(gradient().r.mask(shape(2)))
  .out()`]
  }),
  hyperHydra('tap', {
    description: 'Tap tempo and beat envelopes (beats, beats_). Ctrl+Space+Shift pauses, Ctrl+Shift+number sets speed.',
    provides: { globals: ['beats', 'beats_', 'beatsTri', 'beatsTri_', 'hydraTap'] },
    examples: [`osc(30,.01,beats(1)).out()

// Ctrl + Space Bar for tapping
// Ctrl + , (Comma) for re-sync`]
  }),
  hyperHydra('text', {
    thumbnail: true,
    description: 'Text as a hydra source: text(), strokeText(), fillStrokeText().',
    provides: { globals: ['text', 'strokeText', 'fillStrokeText', 'strokeFillText', 'createText', 'hydraText'] },
    examples: [`hydraText.font = "serif"
hydraText.lineWidth = "2%"
str = " hydra_! "
solid(1,.2)
  .blend(src(o0).scale(1.02).colorama(.02))
  .layer(text(str))
  .diff(strokeText(str).modulateScale(noise(1,1), .4))
  .out()`]
  }),
  hyperHydra('vec4', {
    description: "Construct colors like GLSL's vec4(), vec3() and vec2().",
    provides: { globals: ['vec4', 'vec3', 'vec2'] },
    examples: [`noise()
  .mult(vec4(vec3(0.5), 1))
  .add(vec4([0.5,0].smooth()))
  .layer(vec4(vec3([0, 1, 0.5], vec2(()=>time%1)), 1).mask(shape(4)))
  .out()`]
  }),
  hyperHydra('wrap', {
    thumbnail: true,
    description: 'Change how textures wrap (mirror, repeat, clamp) with hydraWrap. Redefines src, scroll and related functions.',
    provides: { globals: ['hydraWrap'] },
    examples: [`hydraWrap.setMirror()

src(o0)
  .layer(osc().rotate().mask(shape(4,1,0)))
  .scale(.5)
  .blend(noise(),.2)
  .out()`]
  }),
  hyperHydra('abbreviations', {
    doc: false,
    // its one- and two-letter names would clash with ordinary variables
    autoload: false,
    description: 'Write very small hydra code: o(), ns(), sh(), .bl(), .df()... Add it with + to use it.',
    provides: {},
    examples: [`await loadScript("${HYPER_HYDRA_CDN}hydra-abbreviations.js")

o(10, 0.1, 1.2).bl(ns(3)).df(sh(4, 0.6).rt(0, 0.1)).out()`]
  }),

  extraShaders('color', {
    name: 'Color manipulation',
    description: 'Color filters: sepia, levels, monotone, gradients, hsvshift and vector-math color mixing.',
    provides: {
      methods: ['sepia', 'levels', 'monotone', 'grarose', 'grawave', 'graua', 'colcross', 'coldot', 'colboost', 'colreflect', 'hsvshift']
    },
    examples: [`osc(4, 0.1, 1.2)
  .levels(4, 0.8)
  .out(o0)
gradient(1).hsvshift(() => time % 1, 1, 1).out(o1)
noise(3).monotone(3, 0.6, 1).out(o2)
voronoi(5).grarose(1).out(o3)
render()`]
  }),
  extraShaders('cond', {
    name: 'if then else',
    description: 'Switch between two sources depending on a value: ifpos, ifzero, ifeven, splitview.',
    provides: { methods: ['ifpos', 'ifeven', 'ifzero', 'splitview', 'splitviewh'] },
    examples: [`noise(4)
  .ifpos(osc(20, 0.1, 1).kaleid(5), () => Math.sin(time))
  .out()`]
  }),
  extraShaders('noise', {
    name: 'Noise generators',
    description: 'Noise and turbulence sources inspired by F. Kenton Musgrave: turb, warp, cwarp, ncontour...',
    provides: { globals: ['whitenoise', 'colornoise', 'unoise', 'turb', 'uturb', 'warp', 'cwarp', 'ncontour'] },
    examples: [`turb(3, () => time * 0.1, 5).out(o0)
warp(3, () => time * 0.1, 4, 4, 2).out(o1)
ncontour(0.5, 0.05, 4, 2, 0.1, 4).out(o2)
colornoise(2, 1).out(o3)
render()`]
  }),
  extraShaders('softpattern', {
    name: 'Soft patterns',
    description: 'Patterns with smooth transitions, similar to osc() but with more complex shapes: blobs, blinking, smoothsun...',
    // both libraries define concentric(); keep this one when lib-pattern is loaded later
    reapplyAfter: ['extra-shaders/pattern'],
    provides: { globals: ['blinking', 'blobs', 'concentric', 'phasenoise', 'sdfmove', 'smoothsun'] },
    examples: [`blobs(0.2, 0.4, 0.3)
  .modulate(blobs(0.1, 0.6, 0.2), 0.5)
  .out()`]
  }),
  extraShaders('pattern', {
    name: 'Op-art patterns',
    description: 'Op-art patterns: spiral, brick, checker, hextile, lissa, pulse...',
    provides: { globals: ['pulse', 'pulsetrain', 'hextile', 'checker', 'concentric', 'spiral', 'brick', 'wave', 'lissa'] },
    examples: [`spiral(2, 5, 0.3)
  .rotate(() => time * 0.2)
  .diff(brick())
  .out()`]
  }),
  extraShaders('screen', {
    name: 'Screen space operations',
    gallery: 'screenspace',
    description: 'Post-processing in screen space: dithering, blur, edge detection, erode/dilate, pixel sort.',
    provides: {
      methods: [
        'dither', 'dither2', 'dither4', 'ditherrnd', 'ditherrndcolor', 'erode', 'dilate', 'blur', 'blurmore',
        'edge', 'sobelx', 'sobely', 'sharpen', 'emboss', 'altline', 'pxsort', 'pysort'
      ]
    },
    examples: [`osc(10, 0.1, 1.5).kaleid(4).out(o1)
src(o1).dither().out(o0)
src(o1).edge().dilate().out(o2)
src(o1).blurmore().out(o3)
render()`]
  }),
  extraShaders('space', {
    name: 'Space transforms',
    gallery: null,
    thumbnail: false,
    description: 'Coordinate transforms: invtile, invsqrt, abslog, swave, centermag.',
    provides: { methods: ['invtile', 'invsqrt', 'abslog', 'swave', 'centermag'] },
    examples: [`osc(20, 0.1, 1)
  .invtile()
  .out()`]
  }),
  extraShaders('wave', {
    name: 'Periodic waves',
    thumbnail: false,
    description: 'Basic periodic sources: square, triangle, sawtooth and harmonic waves, straight or radial.',
    provides: {
      globals: ['squ', 'usin', 'saw', 'harmonic', 'tri', 'rsqu', 'rusin', 'rsaw', 'rharmonic', 'rtri', 'stripes', 'rstripes']
    },
    examples: [`saw(8, 0.2)
  .mult(rtri(12, -0.1))
  .color(1, 0.5, 0.8)
  .out()`]
  })
]

// URLs people already use in sketches, mapped to the bundled copies:
// cdn.jsdelivr.net/gh/geikha/hyper-hydra[@latest|@main]/hydra-x[.min].js
// metagrowing.org/extra-shaders-for-hydra/lib-x.js (and all.js for every lib)
export function extensionsForURL(url) {
  let parsed
  try {
    parsed = new URL(url, window.location.href)
  } catch (e) {
    return []
  }
  const { hostname, pathname } = parsed
  let match = hostname === 'cdn.jsdelivr.net' &&
    pathname.match(/^\/gh\/(?:geikha|ritchse)\/hyper-hydra(?:@(?:latest|main))?\/hydra-([a-z0-9]+)(?:\.min)?\.js$/)
  if (match) return extensions.filter((ext) => ext.id === `hyper-hydra/${match[1]}`)

  match = hostname === 'metagrowing.org' && pathname.match(/^\/extra-shaders-for-hydra\/(?:lib-([a-z]+)|all)\.js$/)
  if (match) {
    return match[1] ?
      extensions.filter((ext) => ext.id === `extra-shaders/${match[1]}`) :
      extensions.filter((ext) => ext.collection === 'extra-shaders')
  }
  return []
}
