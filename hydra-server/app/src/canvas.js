
const Canvas = function (canvasElem) {
  const sizeCanvas = () => {
    canvasElem.width = Math.min(1280, window.innerWidth)
    canvasElem.height = Math.min(720, window.innerHeight)
    canvasElem.style.width = '100%'
    canvasElem.style.height = '100%'
  }

  return {
    element: canvasElem,
    size: sizeCanvas
  }
}

module.exports = Canvas
