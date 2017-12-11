var MultiPeer = require('./multi-peer'),
    MediaContainer = require('./MediaContainer.js')
    extend = require('extend'),
    inherits = require('inherits')

var PixelParche = function(options){
  this.channel = new MultiPeer(options)
  this.remoteMedia = []
  this.currMedia = null
  this.mediaContainers = []

  var remoteMediaContainer = document.createElement('div');
  remoteMediaContainer.id = "remoteMediaContainer"
  // remoteMediaContainer.style.width = "100%"
  // remoteMediaContainer.style.height = "160px"
  // remoteMediaContainer.style.position = "fixed"
  // remoteMediaContainer.style.bottom = "0px"
  // remoteMediaContainer.style.left = "0px"
  // remoteMediaContainer.style.padding = "0px"

  remoteMediaContainer.style.height = "100%"
  remoteMediaContainer.style.width = "200px"
  remoteMediaContainer.style.position = "fixed"
  remoteMediaContainer.style.top = "0px"
  remoteMediaContainer.style.right = "0px"
  remoteMediaContainer.style.padding = "0px"

 document.body.appendChild(remoteMediaContainer)

  this.remoteMediaContainer = remoteMediaContainer

  this.channel.on('new stream', function(id, stream){
    var media = new MediaContainer(stream, this.remoteMedia.length, id, this)
    this.remoteMediaContainer.appendChild(media.div)
    this.remoteMedia.push(media.vid)
    this.mediaContainers.push(media)
    if(this.currMedia === null) this.currMedia = this.remoteMedia[this.remoteMedia.length-1]
  }.bind(this))

  this.channel.on('close', function(id){

    for(var i = this.mediaContainers.length-1; i >= 0; i--){
      if(this.mediaContainers[i].id== id) {
        this.mediaContainers[i].div.parentNode.removeChild(this.mediaContainers[i].div)
        this.mediaContainers.splice(i, 1)
        this.remoteMedia.splice(i, 1)
      }
    }

    if(this.currMedia.id===id) this.currMedia = null
    for(var i = 0; i < this.mediaContainers.length; i++){
      this.mediaContainers[i].setIndex(i)
    }
  }.bind(this))
}

PixelParche.prototype.setSelected = function(index){
  console.log("CLICK", index, this)
  this.currMedia = this.remoteMedia[index]
}

module.exports = PixelParche


