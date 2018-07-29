/* globals sessionStorage */
// Extends rtc-patch-bay to include support for nicknames and persistent session storage

var PatchBay = require('./rtc-patch-bay.js')
//var PatchBay = require('./../../../../rtc-patch-bay')
var inherits = require('inherits')

var PBLive = function () {
  this.session = {}

  // lookup tables for converting id to nickname
  this.nickFromId = {}
  this.idFromNick = {}

  this.loadFromStorage()
}
// inherits from PatchBay module
inherits(PBLive, PatchBay)

PBLive.prototype.init = function (stream, opts) {
  this.settings = {
    server: opts.server || 'https://patch-bay.glitch.me/',
    room: opts.room || 'patch-bay',
    stream: stream
  }

  this.makeGlobal = opts.makeGlobal || true
  this.setPageTitle = opts.setTitle || true

  if (this.session.id) this.settings.id = this.session.id

  PatchBay.call(this, this.settings)

  if (this.makeGlobal) window.pb = this

  this.on('ready', () => {
    // console.log("ID:", this._userData.uuid, this.session.id)
    if (!this.nick) {
      if (this.session.nick) {
        this.setName(this.session.nick)
      } else {
        this.session.id = this.id
        this.setName(this.session.id)
      }
    }
    console.log('connected to server ' + this.settings.server + ' with name ' + this.settings.id)
  })
  // received a broadcast
  this.on('broadcast', this._processBroadcast.bind(this))
  this.on('new peer', this.handleNewPeer.bind(this))

  window.onbeforeunload = () => {
    this.session.id = window.pb.id
    this.session.nick = this.nick
    sessionStorage.setItem('pb', JSON.stringify(this.session))
  }

  var self = this
  this.on('stream', function (id, stream) {
    console.log('got stream!', id, stream)
    const video = document.createElement('video')
    video.src = window.URL.createObjectURL(stream)
    video.addEventListener('loadedmetadata', () => {
      //  console.log("loaded meta22")
      video.play()
      self.video = video
      self.emit('got video', self.nickFromId[id], video)
    })
  })
}

PBLive.prototype.loadFromStorage = function () {
  if (sessionStorage.getItem('pb') !== null) {
    this.session = JSON.parse(sessionStorage.getItem('pb'))
  }
}

PBLive.prototype.initSource = function (nick, callback) {
  this.initConnectionFromId(this.idFromNick[nick], callback)
//  this.peers[this.idFromNick[nick]].streamCallback = callback
}

// default nickname is just peer id.
// to do: save nickname information between sessions
PBLive.prototype.handleNewPeer = function (peer) {
  // console.log("new peer", peer)
  this.nickFromId[peer] = peer
  this.idFromNick[peer] = peer
  // console.log("THIS IS THE PEER", peer)
  // to do: only send to new peer, not to all
  if (this.nick) {
    this.broadcast({
      type: 'update-nick',
      id: this.id,
      nick: this.nick
    })
  }
}

PBLive.prototype.list = function () {
  var l = Object.keys(this.idFromNick)
  console.log(l)
  return Object.keys(this.idFromNick)
}

// choose an identifying name
PBLive.prototype.setName = function (nick) {
  this.broadcast({
    type: 'update-nick',
    id: this.id,
    nick: nick,
    previous: this.nick
  })
  this.nick = nick
  if (this.setPageTitle) document.title = nick
}

PBLive.prototype._processBroadcast = function (data) {
  if (data.type === 'update-nick') {
    if (data.previous !== data.nick) {
      delete this.idFromNick[this.nickFromId[data.id]]
      this.nickFromId[data.id] = data.nick
      this.idFromNick[data.nick] = data.id
      if (data.previous) {
        console.log(data.previous + ' changed to ' + data.nick)
      } else {
        console.log('connected to ' + data.nick)
      }
    }
  }
}
// PBExtended.prototype.
module.exports = PBLive
