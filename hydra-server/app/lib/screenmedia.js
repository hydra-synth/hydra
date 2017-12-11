const getScreenMedia = require('./getscreenmedia.js')

module.exports = function (options) {
  //const regl = options.regl

  // mandatory: {
  //     chromeMediaSource: 'desktop',
  //     maxWidth: 640,
  //     maxHeight: 480
  // }
  return new Promise(function(resolve, reject) {
    getScreenMedia( {audio: false, video: {
        mandatory: {
            chromeMediaSource: 'desktop'
        }
    }}, function (err, stream) {
    if (err) {
      console.log('error getting screen media', err)
      reject(err)
    } else {
      console.log("got stream", stream)
      const video = document.createElement('video')
      video.src = window.URL.createObjectURL(stream)
     // document.body.appendChild(video)
      video.addEventListener('loadedmetadata', () => {
        video.play()
       // const webcam = regl.texture(video)
        //regl.frame(() => webcam.subimage(video))
        resolve({video: video})
      })
    //resolve()
    }
  })
  })

}
