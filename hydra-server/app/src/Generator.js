/* coord transform functions

types of functions in glsl:

coordinate transforms receive coordinates (vec2) and output coordinates.
i.e. rotate, repeat, scale, modulate?
f(xy) => (xy)


color transforms receive a color (vec4) and output a color (vec4)
i.e. saturate, invert, hue
f(c) => (c)

composite transforms receive two colors and output a single color (vec4)
f(c0, c1) => (c)

src transforms receive coordinates and output a color
i.e. gradient, oscillator, tex2d
f(xy) => (c)

example code:
var rotate_osc = osc().rotate()
var inverted_image = src(s2).invert()
src(s1).mult(rotate_osc).add(gradient()).modulate(inverted_image).out(o1)

var addComp = function(f){
  return function(g){
    return function(h){
      return function(x){
        return h(f(x))(g(x))
      }
    }
  }
} */

const glslTransforms = require('./composable-glsl-functions.js')
const counter = require('./counter.js')

// Functions that return a new transformation function based on the existing function chain as well
// as the new function passed in.
const compositionFunctions = {
  coord: existingF => newF => x => existingF(newF(x)), // coord transforms added onto beginning of existing function chain
  color: existingF => newF => x => newF(existingF(x)), // color transforms added onto end of existing function chain
  combine: existingF1 => existingF2 => newF => x => newF(existingF1(x))(existingF2(x)) //
}


// Parses javascript args to use in glsl
function generateGlsl(userArgs, defaultArgs) {
  var str = ''
  defaultArgs.forEach((input, index)=>{
    // if no user argument is supplied, replace with default value
    var value = userArgs.length > index? userArgs[index] : input.default
    if(input.type=="texture"){
      value = input.name
      // to do: add uniform for passing in texture
    } else if(input.type==="float"){
      //include decimal point if integer
      if(!String(value).includes(".")) value += "."
    }
    str+=", " + value
  })

  return str
}

// receives default inputs for a given glsl function; creates unique names for variables requiring a uniform to be passed in (i.e. a texture)
function generateUniformNames(inputs){
  return inputs.map((input)=>{
    if(input.type === 'texture'){
      counter.increment()
      return Object.assign({}, input, {name: input.name+counter.get()})
    } else {
      return input
    }
  })
}

var Generator = function(param) {
  var obj = Object.create(Generator.prototype);

  //obj.transform = (coords)=>(`osc(${coords}, ${param}.)`)
  return obj
//  (coords)=>(`osc(${coords})`)
}

//
//   iterate through transform types
//
Object.keys(glslTransforms).forEach((method) => {
  const transform = glslTransforms[method]

  //if type is a source, create a new global generator function that inherits from Generator object
  if(transform.type == "src"){
    window[method] = (...args)=>{

      var obj = Object.create(Generator.prototype)

      // const transform.inputs.map((input)=>{
      //   if(input.type === 'texture'){
      //     counter.increment()
      //     return Object.assign({}, input, {name: input.name+counter.get()})
      //   } else {
      //     return input
      //   }
      // })
      const inputs = generateUniformNames(transform.inputs)

      obj.transform = (x)=>{
        var glslString = `${method}(${x}`
        glslString += generateGlsl(args, inputs)
        glslString += ")"
        return glslString
      }

      obj.uniforms = []
      inputs.forEach((input, index) => {
        if(input.type==='texture'){
          if(args[index]) obj.uniforms[input.name] = args[index].getTexture()
        }
      })

      return obj
    }
  } else {
  Generator.prototype[method] = function (...args) {
    const inputs = generateUniformNames(transform.inputs)
    console.log(inputs)

  //  console.log("applying", method, transforms[method])
   if (transform.type=="combine"){
      console.log("args[0] is ", args)

      //composition function to be executed when all transforms have been added
      //c1 and c2 are two inputs.. (explain more)
      var f = (c1)=>(c0)=>{
        var glslString = `${method}(${c0}, ${c1}`
        glslString += generateGlsl(args.slice(1), inputs.slice(1))
        glslString += ")"
        return glslString
      }
      this.transform = compositionFunctions[glslTransforms[method].type](this.transform)(args[0].transform)(f)

      Object.assign(this.uniforms, args[0].uniforms)

    } else {
      var f = (x)=>{
        var glslString = `${method}(${x}`
        glslString += generateGlsl(args, inputs)
        glslString += ")"
        return glslString
      }
      this.transform = compositionFunctions[glslTransforms[method].type](this.transform)(f)
    }

    inputs.forEach((input, index) => {
      if(input.type==='texture'){
        if(args[index]) obj.uniforms[input.name] = args[index].getTexture()
      }
    })


    console.log(this.transform)
    return this
  }
}
})

Generator.prototype.out = function(output){
  console.log("UNIFORMS", this.uniforms)
  var frag = `
  precision mediump float;
  ${Object.keys(this.uniforms).map((uniform)=>{
    return `
      uniform sampler2D ${uniform};`
  }).join("")}
  uniform float time;
  varying vec2 uv;

  ${Object.values(glslTransforms).map((transform)=>{
    console.log(transform.glsl)
    return `
            ${transform.glsl}
          `
  }).join("")}

  void main () {
    vec4 c = vec4(1, 0, 0, 1);
    vec2 st = uv;


    //gl_FragColor = osc(rotate(st, 3.0), 60.0);
    gl_FragColor = ${this.transform("st")};
    //gl_FragColor = osc(st, 43);
  }
  `
  console.log("FRAG", frag)
  output.frag = frag
  output.uniforms = Object.assign(output.uniforms, this.uniforms)
  output.render()

}




module.exports = Generator
