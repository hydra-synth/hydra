var logElement

const init = (el) => {
  // logElement = document.createElement('div')
  // logElement.className = "console cm-s-tomorrow-night-eighties"
  // document.body.appendChild(logElement)
  logElement = el
}
const log = (msg, className = "") => {
  console.log('logging', msg, className)
  if (logElement) logElement.innerHTML = ` >> <span class=${className}> ${msg} </span> `
}
const hide = () => {
  if (logElement) logElement.style.display = 'none'
}
const show = () => {
  if (logElement) logElement.style.display = 'block'
}
const toggle = () => {
  if (logElement.style.display == 'none') {
    logElement.style.display = 'block'
  } else {
    logElement.style.display = 'none'
  }
}


const exports = { init, log, hide, show, toggle }
export { exports as default, log, hide, show, toggle }