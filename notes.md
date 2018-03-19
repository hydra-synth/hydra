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
