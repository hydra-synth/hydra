const repl = require('./repl.js')


class Menu {
  constructor (obj) {
    this.sketches = obj.sketches
    this.editor = obj.editor
    this.hydra = obj.hydra
    this.recorder = undefined
    this.recordingStartTime = undefined
    this.recordingInterval = undefined

    // variables related to popup window
    this.closeButton = document.getElementById("close-icon")
    this.clearButton =  document.getElementById("clear-icon")
    this.shareButton =  document.getElementById("share-icon")
    this.recordingTime =  document.getElementById("recording-time")
    this.recorderButton =  document.getElementById("recorder-icon")
    this.shuffleButton = document.getElementById("shuffle-icon")
    this.editorText = document.getElementsByClassName('CodeMirror-scroll')[0]

    this.recorderButton.onclick = this.recordSketch.bind(this)
    this.shuffleButton.onclick = this.shuffleSketches.bind(this)
    this.shareButton.onclick = this.shareSketch.bind(this)
    this.clearButton.onclick = this.clearAll.bind(this)
    this.closeButton.onclick = () => {
      if(!this.isClosed) {
        this.closeModal()
      } else {
        this.openModal()
      }
    }

    this.isClosed = false
    this.closeModal()
  }

  shuffleSketches() {
    this.clearAll()
    this.sketches.setRandomSketch()
    this.editor.setValue(this.sketches.code)
    repl.eval(this.editor.getValue())
  }

  shareSketch() {
      repl.eval(this.editor.getValue(), (code, error) => {
        console.log('evaluated', code, error)
        if(!error){
          this.showConfirmation( (name) => {
            this.sketches.shareSketch(code, this.hydra, name)
          }, () => this.hideConfirmation() )
        }
      })
  }

  downloadRecording (e) {
    var videoData = [ e.data ]
    var blob = new Blob(videoData, {'type': 'video/webm'})
    var videoURL = URL.createObjectURL(blob)
    var link = document.createElement('a')
    link.href = videoURL
    link.download = "file.webm"
    link.click()
  }

  setTime () {
    let timeSinceStart = new Date().getTime() - this.recordingStartTime
    let minutes = ""+Math.floor((timeSinceStart % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = ""+Math.floor((timeSinceStart % (1000 * 60)) / 1000)
    this.recordingTime.innerText = minutes.padStart(2,"0")
      + ":" + seconds.padStart(2, "0")
  }

  recordSketch (){
    if (this.recordingStartTime) {
      this.recordingStartTime = false
      this.recorderButton.className = "far fa-dot-circle icon"
      this.recorderButton.style = ""
      this.recordingTime.innerText = ""
      clearInterval(this.recordingInterval)
      this.recorder.stop()
    } else {
      this.recordingStartTime = new Date().getTime()
      this.recordingInterval = setInterval(this.setTime.bind(this),1)
      this.recorderButton.className = "fas fa-dot-circle icon"
      this.recorderButton.style = "color:red"
      let canvas = document.querySelector("canvas")
      let canvasStream = canvas.captureStream(30)
      this.recorder = new MediaRecorder(canvasStream, {'mimeType': 'video/webm', 'videoBitsPerSecond': 2500000})
      this.recorder.ondataavailable = this.downloadRecording
      this.recorder.start()
    }
  }

  showConfirmation(successCallback, terminateCallback) {
    var c = prompt("Pressing OK will share this sketch to \nhttps://twitter.com/hydra_patterns.\n\nInclude your name or twitter handle (optional):")
    console.log('confirm value', c)
    if (c !== null) {
      successCallback(c)
    } else {
      terminateCallback()
    }
  }

  hideConfirmation() {

  }

  clearAll() {
    hush()
    this.sketches.clear()
    this.editor.clear()
    //@todo: add clear/reset function to hydra
  }

  closeModal () {
    document.getElementById("info-container").className = "hidden"
    this.closeButton.className = "fas fa-question-circle icon"
    this.shareButton.classList.remove('hidden')
    this.clearButton.classList.remove('hidden')
    this.editorText.style.opacity = 1
    this.isClosed = true
  }

  openModal () {
    document.getElementById("info-container").className = ""
    this.closeButton.className = "fas fa-times icon"
    this.shareButton.classList.add('hidden')
    this.clearButton.classList.add('hidden')
    this.editorText.style.opacity = 0.0
    this.isClosed = false
  }

}

module.exports = Menu
