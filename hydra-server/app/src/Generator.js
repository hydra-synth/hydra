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
}
 // to do:
 // 1. how to validate inputs? and in certain cases apply more functions. i.e. needs color but passed in texture, automatically apply tex() command
 //2. how to specify functions that can receive different types
 //3. any parameter can accept a static variable or a function (!
//4. evaluate block of code like in gibber, highlight when evaluating)

*/

const glslTransforms = require('./composable-glsl-functions.js')
const counter = require('./counter.js')

// Functions that return a new transformation function based on the existing function chain as well
// as the new function passed in.
const compositionFunctions = {
  coord: existingF => newF => x => existingF(newF(x)), // coord transforms added onto beginning of existing function chain
  color: existingF => newF => x => newF(existingF(x)), // color transforms added onto end of existing function chain
  combine: existingF1 => existingF2 => newF => x => newF(existingF1(x))(existingF2(x)), //

  combineCoord: existingF1 => existingF2 => newF => x => existingF1(newF(x)(existingF2(x)))
}
// gl_FragColor = osc(modulate(osc(rotate(st, 10., 0.), 32., 0.1, 0.), st, 0.5), 199., 0.1, 0.);

// Parses javascript args to use in glsl
function generateGlsl(inputs) {

  var str = ''
  inputs.forEach((input)=>{
    // // if no user argument is supplied, replace with default value
    // var value = userArgs.length > index? userArgs[index] : input.default
    // if(input.type=="texture"){
    //   value = input.name
    //   // to do: add uniform for passing in texture
    // } else if(input.type==="float"){
    //   //include decimal point if integer
    //   if(!String(value).includes(".")) value += "."
    // }
    str+=", " + input.value
  })

  return str
}

// when possible, reformats arguments to be the correct type
// creates unique names for variables requiring a uniform to be passed in (i.e. a texture)
// returns an object that contains the type and value of each argument
// to do: add much more type checking, validation, and transformation to this part
function formatArguments(userArgs, defaultArgs){
  return defaultArgs.map((input, index)=>{
    var typedArg = {}
    typedArg.value = userArgs.length > index? userArgs[index] : input.default

    // if input is a texture, set unique name for uniform
    if(input.type === 'texture'){
      counter.increment()
      typedArg.name = input.name+counter.get()
      typedArg.tex = typedArg.value.getTexture()
      typedArg.value = typedArg.name

    } else {
      // if passing in a texture reference, when function asks for vec4, convert to vec4
      if(typedArg.value.tex && input.type == 'vec4'){
        console.log("TYPE MISMATCH", input, typedArg.value)
        //debugger;
        var x = typedArg.value
       typedArg.value = tex(x)
      }
      if(input.type==="float"){
        //include decimal point if integer
        if(!String(typedArg.value).includes(".")) typedArg.value += "."
      }

    }
    typedArg.type = input.type
    return typedArg
  })
}

var Generator = function(param) {
  var obj = Object.create(Generator.prototype);

  //obj.transform = (coords)=>(`osc(${coords}, ${param}.)`)
  return obj
//  (coords)=>(`osc(${coords})`)
}

//
//   iterate through transform types and create a function for each
//
Object.keys(glslTransforms).forEach((method) => {
  const transform = glslTransforms[method]

  //if type is a source, create a new global generator function that inherits from Generator object
  if(transform.type == "src"){
    window[method] = (...args)=>{

      var obj = Object.create(Generator.prototype)
      obj.name = method

      const inputs = formatArguments(args, transform.inputs)

      obj.transform = (x)=>{
        var glslString = `${method}(${x}`
        glslString += generateGlsl(inputs)
        glslString += ")"
        return glslString
      }

      obj.uniforms = []
      inputs.forEach((input, index) => {
        if(input.type==='texture'){
          obj.uniforms[input.name] = input.tex
        }
      })

      return obj
    }
  } else {
  Generator.prototype[method] = function (...args) {
    const inputs = formatArguments(args, transform.inputs)

   if (transform.type=="combine" || transform.type=="combineCoord"){
    //  console.log("args[0] is ", args)

      //composition function to be executed when all transforms have been added
      //c0 and c1 are two inputs.. (explain more)
      var f = (c0)=>(c1)=>{
        var glslString = `${method}(${c0}, ${c1}`
        glslString += generateGlsl(inputs.slice(1))
        glslString += ")"
        return glslString
      }
      this.transform = compositionFunctions[glslTransforms[method].type](this.transform)(inputs[0].value.transform)(f)

      Object.assign(this.uniforms, inputs[0].value.uniforms)

    } else {
      var f = (x)=>{
        var glslString = `${method}(${x}`
        glslString += generateGlsl(inputs)
        glslString += ")"
        return glslString
      }
      this.transform = compositionFunctions[glslTransforms[method].type](this.transform)(f)
    }

    inputs.forEach((input, index) => {
      if(input.type==='texture'){
        obj.uniforms[input.name] = input.tex
      }
    })

    return this
  }
}
})

Generator.prototype.out = function(output){

  var frag = `
  precision mediump float;
  ${Object.keys(this.uniforms).map((uniform)=>{
    return `
      uniform sampler2D ${uniform};`
  }).join("")}
  uniform float time;
  varying vec2 uv;

  ${Object.values(glslTransforms).map((transform)=>{
  //  console.log(transform.glsl)
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
//  console.log("FRAG", frag)
  output.frag = frag
  output.uniforms = Object.assign(output.uniforms, this.uniforms)
  output.render()

}




module.exports = Generator
