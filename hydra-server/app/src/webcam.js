const getUserMedia = require('getusermedia')

module.exports = function (options) {
  //const regl = options.regl


  return new Promise(function(resolve, reject) {
    getUserMedia({video: true, audio: false}, function (err, stream) {
    if (err) {
      reject(err)
    } else {
      const video = document.createElement('video')
      video.src = window.URL.createObjectURL(stream)
     // document.body.appendChild(video)
      video.addEventListener('loadedmetadata', () => {
        video.play().then(()=>  resolve({video: video}))
       // const webcam = regl.texture(video)
        //regl.frame(() => webcam.subimage(video))

      })
    }
  })
  })

}
