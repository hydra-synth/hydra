var io = require('socket.io-client'),
    SimplePeer = require('simple-peer'),
    extend = require('extend')

var events = require('events').EventEmitter;
var inherits = require('inherits')


var MultiPeer = function(options){
  this.signaller = io(options.server)
 // this.stream = options.stream || null
  this._peerOptions = options.peerOptions || {}
  this._room = options.room
  this.peers = {}

  //Handle events from signalling server
  this.signaller.on('peers', this._connectToPeers.bind(this))
  this.signaller.on('signal', this._handleSignal.bind(this))

  //emit 'join' event to signalling server
  this.signaller.emit('join', this._room)
}
//inherits from events module in order to trigger events
inherits(MultiPeer, events)

//send data to all connected peers via data channels
MultiPeer.prototype.send = function(data){
  Object.keys(this.peers).forEach(function(id) {
    this.peers[id].send(data)
  }, this)
}

//Once the new peer receives a list of connected peers from the server, 
//creates new simple peer object for each connected peer. 
MultiPeer.prototype._connectToPeers = function(peers){
  peers.forEach(function(id){
    var options = extend({initiator: true}, this._peerOptions)
    this.peers[id] = new SimplePeer(options)
    this._attachPeerEvents(this.peers[id], id)
  }.bind(this))
}

//receive signal from signalling server, forward to simple-peer
MultiPeer.prototype._handleSignal = function(data){
  //if there is currently no peer object for a peer id, that peer is initiating a new connection.
  if (!this.peers[data.id]) {
    var options = extend({}, this._peerOptions)
    this.peers[data.id] = new SimplePeer(options)
    this._attachPeerEvents(this.peers[data.id], data.id)
  }
  this.peers[data.id].signal(data.signal)
}

//handle events for each connected peer
MultiPeer.prototype._attachPeerEvents = function(p, _id){
  p.on('signal', function (id, signal) {
      console.log("peer signal sending over sockets", id, signal)
      this.signaller.emit('signal', {id: id, signal: signal})
    }.bind(this, _id))

    p.on('stream', function (id, stream) {
      console.log("received a stream", stream)
      this.emit('new stream', id, stream)
    }.bind(this, _id))

    p.on('connect', function () {
      console.log('CONNECT')
    })

     p.on('close', function(id){
        console.log("CLOSED")
        delete(this.peers[id])
        this.emit('close', id)
      }.bind(this, _id))
}

module.exports = MultiPeer


