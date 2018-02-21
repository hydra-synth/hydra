var io = require('socket.io-client'),
    SimplePeer = require('simple-peer'),
    extend = require('extend')

var events = require('events').EventEmitter;
var inherits = require('inherits')


var PatchBay = function(options){
  this.signaller = io(options.server)
 // this.stream = options.stream || null
  this._connectionOptions = options.connectionOptions || {}
  this._room = options.room
  if(options.id){
    this._userData = { uuid: options.id}
  } else {
    this._userData = {}
  }
  this.availableSources = []
  this.media = []

  this.id = null
  this.connections = {}

  //Handle events from signalling server
  this.signaller.on('sources', this._updateSources.bind(this))
  this.signaller.on('signal', this._handleSignal.bind(this))
  this.signaller.on('ready', this._readyForSignalling.bind(this))

  //emit 'join' event to signalling server
  this.signaller.emit('join', this._room)
}
//inherits from events module in order to trigger events
inherits(PatchBay, events)

//send data to all connected sources via data channels
PatchBay.prototype.send = function(data){
  Object.keys(this.availableSources).forEach(function(id) {
    this.connections[id].send(data)
  }, this)
}

PatchBay.prototype._updateSources = function(sources) {
  //console.log(id)
 // document.title = id
  this.availableSources = sources
  this.availableSources.splice(this.availableSources.indexOf(this.id), 1)
  this.emit('sources', this.availableSources)
}

PatchBay.prototype._readyForSignalling = function(id, peers) {

  console.log("ID", id)
  this.id = id
  this.emit('ready', id)
}

//Once the new peer receives a list of connected sources from the server,
//creates new simple peer object for each connected peer.
PatchBay.prototype.initAllSources = function(sources){
  this.availableSources.forEach(function(id){

    this.initSource(id)
  }.bind(this))
}

PatchBay.prototype.initSource = function(id){
  var options = extend({initiator: true}, this._connectionOptions)
 // var options = extend({initiator: true}, this._connectionOptions)
  options.stream = false
  options.offerConstraints = {
    offerToReceiveVideo: true//,
   // offerToReceiveAudio: true
  }
  console.log("media options", options)
  this.connections[id] = {
    peer: new SimplePeer(options)
  }
  this._attachPeerEvents(this.connections[id].peer, id)
}
//receive signal from signalling server, forward to simple-peer
PatchBay.prototype._handleSignal = function(data){
  console.log("ANSWERING SIGNAL")
  //if there is currently no peer object for a peer id, that peer is initiating a new connection.
  if (!this.connections[data.id]) {
    var options = extend({}, this._connectionOptions)
    //options.stream = false
    console.log("answer media options", options)
    this.connections[data.id] = {
      peer: new SimplePeer(options)
    }
    this._attachPeerEvents(this.connections[data.id].peer, data.id)
  }
  this.connections[data.id].peer.signal(data.signal)
}

//handle events for each connected peer
PatchBay.prototype._attachPeerEvents = function(p, _id){
  p.on('signal', function (id, signal) {
      //console.log("peer signal sending over sockets", id, signal)
      this.signaller.emit('signal', {id: id, signal: signal})
    }.bind(this, _id))

    p.on('stream', function (id, stream) {
      console.log("received a stream", stream.getVideoTracks())
      var media = {
        stream: stream
      }
      var vid = document.createElement('video')
      vid.srcObject = stream
      vid.play()
      // vid.width = 200
      // vid.height = 100

      // document.body.appendChild(vid)

      media.vid = vid

      this.connections[id].media = media
      this.media.push(media)

      this.emit('media', media)
    }.bind(this, _id))

    p.on('connect', function () {
      console.log('CONNECT')
    })

     p.on('close', function(id){
        console.log("CLOSED")
        delete(this.connections[id])
        this.emit('close', id)
      }.bind(this, _id))
}

module.exports = PatchBay
