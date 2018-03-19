module.exports = {
  sin: (_amplitude = 1.0, _period = 0.1) => (props) => {
    var {time} = props
    let period = typeof _period === 'function' ? _period(props) : _period
    let amplitude = typeof _amplitude === 'function' ? _amplitude(props) : _amplitude
    return amplitude * Math.sin((Math.PI * 2) * time * period)
  },

  add: (_x = 0, _y = 0) => (props) => {
    let x = typeof _x === 'function' ? _x(props) : _x
    let y = typeof _y === 'function' ? _y(props) : _y
    return x + y
  }

}
