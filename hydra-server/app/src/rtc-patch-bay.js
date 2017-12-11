// Module for handling connections to multiple peers

var io = require('socket.io-client')
var SimplePeer = require('simple-peer')
var extend = Object.assign
var events = require('events').EventEmitter
var inherits = require('inherits')
const shortid = require('shortid')

var PatchBay = function (options) {
// connect to websocket signalling server. To DO: error validation
  this.signaller = io(options.server)
  this._userData = {}
  this._userData.uuid = options.id || shortid.generate()
  this.stream = options.stream || null
 // this.stream = options.stream || null
  this._peerOptions = options.peerOptions || {}
  this._room = options.room
  //object containing peers connected via webrtc
  this.peers = {}

  //object containing peers connected via signalling server
  this.connectedIds = []

  // Handle events from signalling server
  this.signaller.on('ready', this._readyForSignalling.bind(this))
//  this.signaller.on('peers', )
  this.signaller.on('signal', this._handleSignal.bind(this))

  this.signaller.on('broadcast', this._receivedBroadcast.bind(this))
  // emit 'join' event to signalling server
  this.signaller.emit('join', this._room, this._userData)

  this.signaller.on('new peer', this._newPeer.bind(this))
}
// inherits from events module in order to trigger events
inherits(PatchBay, events)

// send data to all connected peers via data channels
PatchBay.prototype.sendToAll = function (data) {
  Object.keys(this.peers).forEach(function (id) {
    this.peers[id].send(data)
  }, this)
}

PatchBay.prototype.sendToPeer = function (peerId, data) {
  if (peerId in this.peers) {
    this.peers[peerId].send(data)
  }
}

PatchBay.prototype.reinitAll = function(){
  Object.keys(this.peers).forEach(function (id) {
    this.reinitPeer(id)
  }.bind(this))
//  this._connectToPeers.bind(this)
}

PatchBay.prototype.reinitPeer = function(id){
  this.peers[id].destroy(function(e){
  //  console.log("closed!", e)
    this.emit('new peer', {id: id})
    var newOptions = {initiator: true}
    if (this.stream != null) {
      newOptions.stream = this.stream
    } else {
    //  console.log('stream is null')
    }
    var options = extend(newOptions, this._peerOptions)

    this.peers[id] = new SimplePeer(options)
    this._attachPeerEvents(this.peers[id], id)

  }.bind(this))
}
//new peer connected to signalling server
PatchBay.prototype._newPeer = function (peer){
    // this.connectedIds.push(peer)
    // this.emit('updated peer list', this.connectedIds)
}
// // Once the new peer receives a list of connected peers from the server,
// // creates new simple peer object for each connected peer.
PatchBay.prototype._readyForSignalling = function (_t, peers) {
  peers.forEach((peer)=>{
    this._newPeer(peer)
  })
  this.emit('ready')
}

// to do: return stream in callback
PatchBay.prototype.initConnectionFromId = function(id, callback){
//  console.log("initianing connection")
  if(id in this.peers){
    console.log("Already connected to..", id, this.peers)
    //if this peer was originally only sending a stream (not receiving), recreate connecting but this time two-way
    if(this.peers[id].initiator===false){
      this.reinitPeer(id)
    } else {
      //already connected, do nothing

    }
  } else {
    var newOptions = {initiator: true}
    newOptions.stream = false
    newOptions.offerConstraints = {
      offerToReceiveVideo: true//,
     // offerToReceiveAudio: true
    }
    var options = extend(newOptions, this._peerOptions)

    this.peers[id] = new SimplePeer(options)
    this._attachPeerEvents(this.peers[id], id)
  }
}
// receive signal from signalling server, forward to simple-peer
PatchBay.prototype._handleSignal = function (data) {
  // if there is currently no peer object for a peer id, that peer is initiating a new connection.
  if (!this.peers[data.id]) {
    this.emit('new peer', data)
    var options = extend({stream: this.stream}, this._peerOptions)
    this.peers[data.id] = new SimplePeer(options)
    this._attachPeerEvents(this.peers[data.id], data.id)
  }
  this.peers[data.id].signal(data.signal)
}
// sendToAll send through rtc connections, whereas broadcast
// send through the signalling server. Useful in cases where
// not all peers are connected via webrtc with other peers
PatchBay.prototype._receivedBroadcast = function(data) {
  //console.log("RECEIVED BROADCAST", data)
  this.emit('broadcast', data)
}

//sends via signalling server
PatchBay.prototype.broadcast = function (data) {
  this.signaller.emit('broadcast', data)
}
// handle events for each connected peer
PatchBay.prototype._attachPeerEvents = function (p, _id) {
  p.on('signal', function (id, signal) {
  //  console.log('signal', id, signal)
    //  console.log("peer signal sending over sockets", id, signal)
    this.signaller.emit('signal', {id: id, signal: signal})
  }.bind(this, _id))

  p.on('stream', function (id, stream) {
  //  console.log('E: stream', id, stream)
    //  console.log("received a stream", stream)
    this.emit('stream', id, stream)
  }.bind(this, _id))

  p.on('connect', function (id) {
  //  console.log("connected to ", id)
    this.emit('connect', id)
  }.bind(this, _id))

  p.on('data', function (id, data) {
//    console.log('data', id)
    this.emit('data', {id: id, data: JSON.parse(data)})
  }.bind(this, _id))

  p.on('close', function (id) {
    //console.log('CLOSED')
    delete (this.peers[id])
    this.emit('close', id)
  }.bind(this, _id))
}

PatchBay.prototype._destroy = function () {
  Object.values(this.peers).forEach( function (peer) {
    peer.destroy()
  })
  this.signaller.close()
}

PatchBay.prototype.getLocalId = function () {
  return this._userData.uuid
}

module.exports = PatchBay
