var logElement

module.exports = {
  init: () => {
    logElement = document.createElement('div')
    logElement.className = "console cm-s-tomorrow-night-eighties"
    document.body.appendChild(logElement)
  },
  log: (msg, className = "") => {
    if(logElement) logElement.innerHTML =` >> <span class=${className}> ${msg} </span> `
  }
}
