//coord transform functions

// types of functions in glsl:

//coordinate transforms receive coordinates (vec2) and output coordinates.
// i.e. rotate, repeat, scale, modulate?
// f(xy) => (xy)
//

//color transforms receive a color (vec4) and output a color (vec4)
//i.e. saturate, invert, hue
// f(c) => (c)

//composite transforms receive two colors and output a single color (vec4)
// f(c0, c1) => (c)

// src transforms receive coordinates and output a color
// i.e. gradient, oscillator, tex2d
// f(xy) => (c)

// example code:
// var rotate_osc = osc().rotate()
// var inverted_image = src(s2).invert()
// src(s1).mult(rotate_osc).add(gradient()).modulate(inverted_image).out(o1)

// var addComp = function(f){
//   return function(g){
//     return function(h){
//       return function(x){
//         return h(f(x))(g(x))
//       }
//     }
//   }
// }

// Functions that return a new transformation function based on the existing function chain as well
// as the new function passed in.
const compositionFunctions = {
  coord: existingF => newF => x => existingF(newF(x)), // coord transforms added onto beginning
  color: existingF => newF => x => newF(existingF(x)), // color transforms added onto end
  combine: existingF1 => existingF2 => newF => x => newF(existingF1(x))(existingF2(x)) //
}

// combine f => g => h => x => h(f(x))(g(x))
// to use add:: var osc = (coords)=>(`osc(${coords})`)
// test.add(osc)


var glslTransforms = {
  osc: {
    type: "src",
    inputs: [
      {
        name: 'frequency',
        type: 'float',
        default: 60.0
      },
      {
        name: 'sync',
        type: 'float',
        default: 0.1
      },
      {
        name: 'offset',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec4 osc(vec2 st, float freq, float sync, float offset){
            float r = sin((st.x-offset/100.+time*sync)*freq)*0.5 + 0.5;
            float g = sin((st.x+time*sync)*freq)*0.5 + 0.5;
            float b = sin((st.x+offset/100.+time*sync)*freq)*0.5 + 0.5;
            return vec4(r, g, b, 1.0);
          }`
  },
  src: {
    type: "src",
    inputs:[
      {
        name: 'tex',
        type: 'texture'
      }
    ],
    glsl: `vec4 src(vec2 _st, sampler2D _tex){
      return texture2D(_tex, _st);
    }`
  },
  rotate: {
    type: "coord",
    inputs: [
      {
        name: 'angle',
        type: 'float',
        default: 10.0
      }, {
        name: 'speed',
        type: 'float',
        default: 0.0
      }
    ],
    glsl: `vec2 rotate(vec2 st, float _angle, float speed){
              vec2 xy = st - vec2(0.5);
              float angle = _angle + speed *time;
              xy = mat2(cos(angle),-sin(angle), sin(angle),cos(angle))*xy;
              xy += 0.5;
              return xy;
          }`
  },

  add: {
    type: "combine",
    inputs: [
      {
        name: 'color',
        type: 'vec4'
      },
      {
        name: 'amount',
        type: 'float',
        default: 0.5
      }
    ],
    glsl: `vec4 add(vec4 c0, vec4 c1, float amount){
            return amount*c0 + (1.0-amount)*c1;
          }`
  }
}

// function(paramArray){
//
// }
// repeat: {
//   type: "coord",
//   f:  (amount)=>(coords)=>(`repeat(${coords},${amount})`)
// },
// saturate: {
//   type: "color",
//   f: (amount)=>(c0)=>(`saturate(${c0},${amount})`)
// },

var Generator = function(param) {
  var obj = Object.create(Generator.prototype);

  //obj.transform = (coords)=>(`osc(${coords}, ${param}.)`)
  return obj
//  (coords)=>(`osc(${coords})`)
}

// function src(emptyString, srcFunction){
//   return srcFunction
// }
Object.keys(glslTransforms).forEach((method) => {
  const transform = glslTransforms[method]
  if(transform.type == "src"){
    window[method] = (...args)=>{
      var obj = Object.create(Generator.prototype)
      obj.transform = (x)=>{
        var glslString = `${method}(${x}`
        transform.inputs.forEach((input, index)=>{
          var value = args.length > index? args[index] : input.default
          if(input.type=="texture"){
            // to do: add uniform for passing in texture
          } else if(input.type==="float"){
            if(!String(value).includes(".")) value += "."
          }
          console.log("arg input", value)
          glslString+=", " + value
        })
        glslString += ")"
        return glslString
      }
      return obj
    }
  } else {
  Generator.prototype[method] = function (...args) {

  //  console.log("applying", method, transforms[method])
   if (transform.type=="combine"){
      console.log("args[0] is ", args)

      //composition function to be executed when all transforms have been added
      //c1 and c2 are two inputs.. (explain more)
      var f = (c1)=>(c0)=>{
        var glslString = `${method}(${c0}, ${c1}`
        transform.inputs.forEach((input, index)=>{
          //first argument is already accounted for in c1, add one to index
          if(index > 0) {
            var value = args.length > index? args[index] : input.default
            if(!String(value).includes(".")) value += "."
            glslString+=", " + value
          }
        })
        glslString += ")"
        return glslString
      }
      this.transform = compositionFunctions[glslTransforms[method].type](this.transform)(args[0].transform)(f)

    } else {
      var f = (x)=>{
        var glslString = `${method}(${x}`
        transform.inputs.forEach((input, index)=>{
          var value = args.length > index? args[index] : input.default
          if(!String(value).includes(".")) value += "."
          glslString+=", " + value
        })
        glslString += ")"
        return glslString
      }
      this.transform = compositionFunctions[glslTransforms[method].type](this.transform)(f)
    }

    console.log(this.transform)
    return this
  }
}
})

Generator.prototype.out = function(output){
  console.log(this.transform("st"))
  var frag = `
  precision mediump float;

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
  //console.log(output)
  output.frag = frag
  output.render()
  //return this.transform
}

//var test = src()

//test().rotate()


module.exports = Generator
//
//
//
// repeat: (amount)=>{
//     f = comp(f)(transforms.repeat(amount))
//     console.log(f)
//     return this
//   },
//   saturate: (amount)=>{
//     f = reverseComp(f)(transforms.saturate(amount))
//   },
//   out: ()=>{
//     console.log(f("xy"))
//   }
// }
// Src.prototype.rotate = (amoun)=>)
//   var f = (coords)=>`osc(${coords})`
//
//   var transforms = {
//     rotate: (amount)=>(coords)=>(`rotate(${coords},${amount})`),
//     repeat: (amount)=>(coords)=>(`repeat(${coords},${amount})`),
//     saturate: (amount)=>(color)=>(`saturate(${color}, ${amount})`)
//   }
//   return ()=>({
//     rotate: (amount)=>{
//       f = comp(f)(transforms.rotate(amount))
//       console.log(f, this)
//       return this
//     },
//     repeat: (amount)=>{
//       f = comp(f)(transforms.repeat(amount))
//       console.log(f)
//       return this
//     },
//     saturate: (amount)=>{
//       f = reverseComp(f)(transforms.saturate(amount))
//     },
//     out: ()=>{
//       console.log(f("xy"))
//     }
//   })
// }


//
//
// //for source functions. similar to pipe()
// const reverseComp = f => g => x => g(f(x))
//
// //for composition functions
// const addComp = function(f){
//   return function(g){
//     return function(h){
//       return function(x){
//         return h(f(x))(g(x))
//       }
//     }
//   }
// }
//
// //const addComp = f => g => h => x
// var oscDef = function(coords) {
//   return `osc(${coords})`
// }
//
// var rotateDef = function(coords) {
//   return `rotate(${coords})`
// }
//
// var repeatDef = function(coords) {
//   return `repeat(${coords})`
// }
//
// var texDef = function(coords) {
//   return function (tex) {
//     return `texture2d(${tex}, ${coords})`
//   }
// }
//
// var addDef = function(c1) {
//   return function(c2) {
//     return `${c1} + ${c2}`
//   }
// }
//
// var modulateDef = function(coords) {
//   return function(c0) {
//     return `modulate`
//   }
// }
// //var test = comp (reverseComp (comp (repeat) (rotate)) (osc)) (add) (4) (8)
//  //var test = comp (comp (reverseComp (comp (repeat) (rotate)) (osc))(repeat))(repeat) (4)
// // var test = comp (repeat) (rotate) (3)
// // console.log(test)
//
// var osc = () => oscDef
//
// var repeat = f => comp (repeatDef)(f)
// //var reverse =
// console.log(JSON.stringify(osc))
// // var test2 = comp (osc) (rotate)(2) ("hi")
// // console.log(add(tex(rotate('xxx'))('mytex'))('boo'))
// //
// // console.log(test2)
// // // ?? how to apply transforms
// // var transform = function(transform){
// //   return function(string) {
// //     return string
// //   }
// // }
// //
// // const compExpand = function(f){
// //   return function(g){
// //     return function(x){
// //       f(g(x))
// //     }
// //   }
// // }
//  //console.log(comp2 (mul) (test))
// // //////
// //
