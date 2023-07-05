//'use babel'

// const p5lib = require('p5')

class P5 extends p5{
  constructor ({
    width = window.innerWidth,
    height = window.innerHeight,
    mode = 'P2D'
  } = {}) {
    //console.log('createing canvas', width, height, window.innerWidth, window.innerHeight)
    super(( p ) => {
      p.setup = () => { p.createCanvas(width, height, p[mode]) }
  //    p.setup = () => { p.createCanvas() }
      p.draw = () => { }
    }, document.getElementById('hydra-ui'))
    this.width = width
    this.height = height
    this.mode = mode
    if (!this.canvas) {
      this.setup();
      const p5 = this;
      window.addEventListener('load', () => {
        p5.hide();
      });
    }
    this.canvas.style.position = "absolute"
    this.canvas.style.top = "0px"
    this.canvas.style.left = "0px"
    this.canvas.style.zIndex = -1
    // console.log('p5', this)
  //  return this.p5
  }

  show() {
    this.canvas.style.visibility = "visible"
  }

  hide() {
    this.canvas.style.visibility = "hidden"
  }

  // p5 clear function not covering canvas
  clear() {
    this.drawingContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

module.exports = P5
