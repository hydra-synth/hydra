


class Menu {
  constructor (obj) {
    this.sketches = obj.sketches
    this.editor = obj.editor
    this.hydra = obj.hydra

    // variables related to popup window
    this.closeButton = document.getElementById("close-icon")
    this.clearButton =  document.getElementById("clear-icon")
    this.shareButton =  document.getElementById("share-icon")
    this.shuffleButton = document.getElementById("shuffle-icon")
    this.editorText = document.getElementsByClassName('CodeMirror-scroll')[0]

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
    this.editor.cm.setValue(this.sketches.code)
    this.editor.evalAll()
  }

  shareSketch() {
    this.editor.evalAll((code, error) => {
      console.log('evaluated', code, error)
      if(!error){
        this.showConfirmation( (name) => {
          this.sketches.shareSketch(code, this.hydra, name)
        }, () => this.hideConfirmation() )
      }
    })
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
