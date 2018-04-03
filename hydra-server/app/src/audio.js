const Meyda = require('meyda')
const getUserMedia = require('getusermedia')

class Audio {
  constructor () {
    this.vol = 0
    this.bins = [0, 0, 0, 0]
    this.canvas = document.getElementById('audio-canvas')
    this.canvas.width = 200
    this.canvas.height = 100
    this.canvas.style.width = "200px"
    this.canvas.style.height = "100px"

    this.ctx = this.canvas.getContext('2d')

    getUserMedia(
      {video: false, audio: true},
      (err, stream) => {
        if(err) {
          console.log('ERROR', err)
        } else {
          console.log('got mic stream', stream)
          this.stream = stream
          this.context = new AudioContext()
          this.context = new AudioContext()
          let audio_stream = this.context.createMediaStreamSource(stream)

          console.log(this.context)
          this.meyda = Meyda.createMeydaAnalyzer({
            audioContext: this.context,
            source: audio_stream,
            featureExtractors: [
              'loudness',
              'perceptualSpread',
              'perceptualSharpness',
              'spectralCentroid'
            ]
          })

          //this.meyda.start()
        }
      })
  }

  tick() {
   if(this.meyda){
     var features = this.meyda.get()
     if(features && features !== null){
       this.vol = features.loudness.total

       const reducer = (accumulator, currentValue) => accumulator + currentValue;

       this.bins[0] = features.loudness.specific.slice(0, 6).reduce(reducer)
       this.bins[1] = features.loudness.specific.slice(6, 12).reduce(reducer)
       this.bins[2] = features.loudness.specific.slice(12, 18).reduce(reducer)
       this.bins[3] = features.loudness.specific.slice(18, 24).reduce(reducer)

       this.draw()
     }
   }
  }

  draw () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    var spacing = this.canvas.width / this.bins.length
  //  console.log(this.bins)
    this.bins.forEach((bin, index) => {
      var height = bin * 10
     this.ctx.fillRect(index * spacing, this.canvas.height - height, spacing, height)
    })

  }
}

module.exports = Audio
