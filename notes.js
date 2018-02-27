existingF1 => existingF2 => newF => x => ((c0)=>(c1)=>(gkkk))(existingF1(x))(existingF2(x))


var colorTransform = existingF => newF => x => newF(existingF(x))

var existingF = (x)=>`osc(${x})`
ver newF = (x)=>`rotate(${x})`
add(osc(rotate(xy)), osc(rotate(xy)))
