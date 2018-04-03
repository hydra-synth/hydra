
const Canvas = function (canvasElem) {
  const sizeCanvas = () => {
    canvasElem.width = 1280
    canvasElem.height = 720
    canvasElem.style.width = '100%'
    canvasElem.style.height = '100%'
  }

  return {
    element: canvasElem,
    size: sizeCanvas
  }
}

module.exports = Canvas
