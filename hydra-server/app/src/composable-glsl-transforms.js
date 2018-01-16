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


var transformFunctions = {
  osc: {
    type: "src",
    glsl: `vec4 osc(vec2 xy, float frequency){
      return vec4(1.0, 0.0, 0.0)
    }`,
    f: (xy)=>(`osc(${coords})`)
  },
  rotate: {
    type: "coord",
    f:  (amount)=>(coords)=>(`rotate(${coords},${amount})`)
  },
  repeat: {
    type: "coord",
    f:  (amount)=>(coords)=>(`repeat(${coords},${amount})`)
  },
  saturate: {
    type: "color",
    f: (amount)=>(c0)=>(`saturate(${c0},${amount})`)
  },
  add: {
    type: "combine",
    f: (amount)=>(c1)=>(c0)=>(`add(${c1}, ${c0}, ${amount})`)
  }
}



var Generator = function(param) {
  var obj = Object.create(Generator.prototype);

  obj.baseFunction = (coords)=>(`osc(${coords}, ${param}.)`)
  return obj
//  (coords)=>(`osc(${coords})`)
}

// function src(emptyString, srcFunction){
//   return srcFunction
// }
Object.keys(transformFunctions).forEach((method) => {
  Generator.prototype[method] = function (...args) {
  //  console.log("applying", method, transforms[method])
    if(transformFunctions[method].type=="src"){
      this.baseFunction = (coords)=>(`osc(${coords})`)
    } else if (transformFunctions[method].type=="combine"){
      console.log("args[0] is ", args)

      this.baseFunction = compositionFunctions[transformFunctions[method].type](this.baseFunction)(args[0].baseFunction)(transformFunctions[method].f(args[1]))

    } else {
      this.baseFunction = compositionFunctions[transformFunctions[method].type](this.baseFunction)(transformFunctions[method].f(args[0]))
    }

    console.log(this.baseFunction)
    return this
  }
})

Generator.prototype.out = function(output){
  console.log(this.baseFunction("st"))
  var frag = `
  precision mediump float;

  uniform float time;
  varying vec2 uv;

  vec4 osc(vec2 st, float freq){
    float r = sin((st.x+time*0.1)*freq)*0.5 + 0.5;
    float g = sin((st.x+time*0.1)*freq)*0.5 + 0.5;
    float b = sin((st.x+time*0.1)*freq)*0.5 + 0.5;
    return vec4(r, g, b, 1.0);
  }

  vec2 rotate(vec2 st, float angle){
    vec2 xy = st - vec2(0.5);
    xy = mat2(cos(angle),-sin(angle), sin(angle),cos(angle))*xy;
    xy += 0.5;
    return xy;
  }

  vec4 add(vec4 c0, vec4 c1, float amount){
    return amount*c0 + (1.0-amount)*c1;
  }

  void main () {
    vec4 c = vec4(1, 0, 0, 1);
    vec2 st = uv;


    //gl_FragColor = osc(rotate(st, 3.0), 60.0);
    gl_FragColor = ${this.baseFunction("st")};
    //gl_FragColor = osc(st, 43);
  }
  `
  //console.log(output)
  output.frag = frag
  output.render()
  //return this.baseFunction
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
