// Extends rtc-patch-bay to include support for nicknames and persistent session storage

var extend = Object.assign
var PatchBay = require('./rtc-patch-bay.js')
var inherits = require('inherits')


var PBLive = function () {
  this.session = {}

  //nicknames of available streams
  this.available = {}

  //lookup tables for converting id to nickname
  this.nickFromId = {}
  this.idFromNick = {}

  this.loadFromStorage()

  //this.init(stream)
}
// inherits from PatchBay module
inherits(PBLive, PatchBay)

PBLive.prototype.init = function(stream, opts){
  // this.settings = {
  //   server: "https://patch-bay.glitch.me/",
  //   room: "iclc",
  //   stream: stream
  // }

  this.settings = {
    server: "https://patch-bay.glitch.me/",
    room: "iclc",
    stream: stream
  }

  if(opts){
    if('server' in opts) this.settings.server = opts.server
    if('room' in opts) this.settings.room = opts.room
  }

  if(this.session.id) this.settings.id = this.session.id


  // to do -- destroy existing pb
    PatchBay.call(this, this.settings)
    window.pb = this

    this.on('ready', ()=>{
//console.log("ID:", this._userData.uuid, this.session.id)
      if(!this.nick){
        if(this.session.nick) {

          this.setName(this.session.nick)

        } else {
          this.session.id = this._userData.uuid
          this.setName(this.session.id)
        }
      }
      console.log("connected to server "+ this.settings.server + " with name " + this.settings.id)
    })
    //received a broadcast
    this.on('broadcast', this._processBroadcast.bind(this))

    window.onbeforeunload = ()=>{
      this.session.id = window.pb.getLocalId()
      this.session.nick = this.nick
      sessionStorage.setItem("pb", JSON.stringify(this.session))
    }
    var self = this
    this.on('stream', function(id, stream){
      console.log("got stream!", id, stream)
        this.peers[id].stream = stream
        const video = document.createElement('video')
        video.src = window.URL.createObjectURL(stream)
        // video.width = 800
        // video.height = 600
       // document.body.appendChild(video)
        video.addEventListener('loadedmetadata', () => {
        //  console.log("loaded meta22")
        video.play()
        self.video = video
        self.emit('got video', self.nickFromId[id], video)
        //self.tex = self.regl.texture(self.video)
      //  vs.addStreamSource(stream)

      })
      //check whether received stream corresponds to requested stream
      //if(id==pb.idFromNick[streamName]){
      //   var video = document.createElement('video')
      //   video.src = window.URL.createObjectURL(stream)
      //   // video.width = 800
      //   // video.height = 600
      //  // document.body.appendChild(video)
      //  video.play()
      //  console.log("video", video)
      //   video.addEventListener('loadedmetadata', () => {
      //     console.log("loaded meta")
      //   self.emit('video source', self.nickFromId[id], video)
      //   self.peers[id].video = video

        // if(this.peers[id] && this.peers[id].streamCallback){
        //   this.peers[id].streamCallback(null, video)
        // }

        // self.video = video
        // self.tex = self.regl.texture(self.video)
      //  vs.addStreamSource(stream)

      })
    //})
}

PBLive.prototype.loadFromStorage = function(){
  if (sessionStorage.getItem("pb") !== null) {
    this.session = JSON.parse(sessionStorage.getItem("pb"))
  }
}

PBLive.prototype.initSource = function(nick, callback) {
  this.initConnectionFromId(this.idFromNick[nick])
//  this.peers[this.idFromNick[nick]].streamCallback = callback

}

//default nickname is just peer id.
// to do: save nickname information between sessions
PBLive.prototype._newPeer = function (peer){
  //console.log("new peer", peer)
    this.nickFromId[peer] = peer
    this.idFromNick[peer] = peer

  //  console.log("THIS IS THE PEER", peer)
    //to do: only send to new peer, not to all
    if(this.nick){
      this.broadcast({
        type: "update-nick",
        id: this._userData.uuid,
        nick: this.nick
      })
    }
}

PBLive.prototype.list = function(){
  var l = Object.keys(this.idFromNick)
  console.log(l)
  return Object.keys(this.idFromNick)
}

//choose an identifying name
PBLive.prototype.setName = function(nick) {

  this.broadcast({
    type: "update-nick",
    id: this._userData.uuid,
    nick: nick,
    previous: this.nick
  })
  this.nick = nick
  document.title = nick
}

PBLive.prototype._processBroadcast = function(data) {
  if(data.type==='update-nick'){
    if(data.previous !== data.nick){
      delete this.idFromNick[this.nickFromId[data.id]]
      this.nickFromId[data.id] = data.nick
      this.idFromNick[data.nick] = data.id
      if(data.previous){
        console.log(data.previous  + " changed to " + data.nick)
      } else {
        console.log("connected to " + data.nick)
      }
    }
  }
}
// PBExtended.prototype.
module.exports = PBLive
