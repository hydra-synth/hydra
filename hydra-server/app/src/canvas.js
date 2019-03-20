
const Canvas = function (canvasElem) {
  const sizeCanvas = () => {
    canvasElem.width = 3840;//Math.min(1920, window.innerWidth)
    canvasElem.height = 2160;//Math.min(1080, window.innerHeight)
    canvasElem.style.width = '100%'
    canvasElem.style.height = '100%'
  }

  return {
    element: canvasElem,
    size: sizeCanvas
  }
}

module.exports = Canvas
