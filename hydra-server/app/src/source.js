const Webcam = require('./webcam.js')
const Screen = require('./../lib/screenmedia.js')

var Source = function (opts) {
  this.regl = opts.regl
  this.video = null
  this.tex = this.regl.texture({
  //  flipY: true
  })
  this.pb = opts.pb
}

Source.prototype.initCam = function () {
  this.init({type: 'cam'})
}

Source.prototype.initScreen = function () {
  this.init({type: 'screen'})
}

Source.prototype.initStream = function (streamName) {
  var self = this
  // to do: check whether contains id
  this.pb.initSource(streamName)
  // pb.on('stream', function(id, stream){
  this.pb.on('got video', function (id, video) {
    console.log('got stream!', id, video)
    self.video = video
    self.tex = self.regl.texture(self.video)
  })
}

Source.prototype.clear = function () {
  this.video = null
}

Source.prototype.init = function (opts) {
//  console.log("initializeing")
  const self = this
  if (opts.type === 'cam') {
    Webcam().then(function (response) {
      self.video = response.video
      self.tex = self.regl.texture(self.video)
    //  console.log("received camera input", self)
    })
  } else if (opts.type === 'screen') {
    Screen().then(function (response) {
      self.video = response.video
      self.tex = self.regl.texture(self.video)
    //  console.log("received screen input")
    })
  //  to do: delete stream
  } else if (opts.type === 'stream') {
    if (opts.stream) {
    //  console.log("STREAM", opts.stream)
      const video = document.createElement('video')
      //  video.src = URL.createObjectURL(localStream)
      video.srcObject = opts.stream
      video.addEventListener('loadedmetadata', () => {
        self.video = video
        self.tex = self.regl.texture(self.video)
      })
    }
  }
}

Source.prototype.tick = function (t) {
  if (this.video !== null) {
    this.tex.subimage(this.video)
  }
}

Source.prototype.getTexture = function () {
  return this.tex
}

module.exports = Source
