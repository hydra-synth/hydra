s0.initCam()

countdown = () => ['9','8','7','6','5','4','3','2','1']
crossRef = () => ['5','4','3','2','1']
timeLength = () => time.toString().split(".")[0].length
timeTwo = () => Number(time.toString()[timeLength() - 2])
timeOne = () => Number(time.toString()[timeLength() - 1])
scroll = (amount) => time/amount
endOfTime = () => {
  var two = timeTwo()
  var one = timeOne()
  var cri = Math.abs(5 - two)
  if (two > 5 && (two/2) == 0) {
    return Number(crossRef()[cri] + "." + countdown()[one])
  } else if (Number(two > 5)) {
    return Number(crossRef()[cri] + "." + one)
  } else {
    return Number(two.toString() + "." + one.toString())
  }
}

src(s0).saturate(1.3).contrast(1.3).color(1,0.42,1).layer(src(o0).mask(shape(4,2).scale(0.5,0.7).scrollX(() => scroll(32))).scrollX(() => scroll(97))).modulate(o0,0.002).scrollX(() => scroll(52)).modulate(noise(() => endOfTime(),() => Number(0.1 * endOfTime().toString())),0.21).out(o0)
