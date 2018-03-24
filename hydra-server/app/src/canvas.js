
const Canvas = function (canvasElem) {
  const sizeCanvas = () => {
    canvasElem.width = window.innerWidth
    canvasElem.height = window.innerHeight
    canvasElem.style.width = '100%'
    canvasElem.style.height = '100%'
  }

  return {
    element: canvasElem,
    size: sizeCanvas
  }
}

module.exports = Canvas
