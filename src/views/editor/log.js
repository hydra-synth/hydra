var logElement

module.exports = {
  init: (el) => {
    // logElement = document.createElement('div')
    // logElement.className = "console cm-s-tomorrow-night-eighties"
    // document.body.appendChild(logElement)
    logElement = el
  },
  log: (msg, className = "") => {
    console.log('logging', msg, className)
    if(logElement) logElement.innerHTML =` >> <span class=${className}> ${msg} </span> `
  },
  hide: () => {
    if(logElement) logElement.style.display = 'none'
  },
  show: () => {
    if(logElement) logElement.style.display = 'block'
  },
  toggle: () => {
    if(logElement.style.display == 'none') {
      logElement.style.display = 'block'
    } else {
      logElement.style.display = 'none'
    }
  }
}
