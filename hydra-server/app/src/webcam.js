const getUserMedia = require('getusermedia')

module.exports = function (options) {
  return new Promise(function (resolve, reject) {
    getUserMedia({video: true, audio: false}, function (err, stream) {
      if (err) {
        reject(err)
      } else {
        const video = document.createElement('video')
        video.src = window.URL.createObjectURL(stream)
        video.addEventListener('loadedmetadata', () => {
          video.play().then(() => resolve({video: video}))
        })
      }
    })
  })
}
