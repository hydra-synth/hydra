// Module for handling connections to multiple peers.


var io = require('socket.io-client')
var SimplePeer = require('simple-peer')
var extend = Object.assign
var events = require('events').EventEmitter
var inherits = require('inherits')
const shortid = require('shortid')

var PatchBay = function (options) {
// connect to websocket signalling server. To DO: error validation
  this.signaller = io(options.server)

  //assign unique id to this peer, or use id passed in

  this.id = options.id || shortid.generate()

  this.stream = options.stream || null

  //options to be sent to simple peer
  this._peerOptions = options.peerOptions || {}
  this._room = options.room


  this.settings = {
    shareMediaWhenRequested: true,
    shareMediaWhenInitiating: false,
    requestMediaWhenInitiating: true,
    autoconnect: false
  }

  //object containing ALL peers in room
  this.peers = {}

  //object containing peers connected via webrtc
  this.rtcPeers = {}

  // Handle events from signalling server
  this.signaller.on('ready', this._readyForSignalling.bind(this))
//  this.signaller.on('peers', )
//  this.signaller.on('signal', this._handleSignal.bind(this))
  this.signaller.on('message', this._handleMessage.bind(this))
  // Received message via websockets to all peers in room
  this.signaller.on('broadcast', this._receivedBroadcast.bind(this))

  // emit 'join' event to signalling server
  this.signaller.emit('join', this._room, {uuid: this.id})

  this.signaller.on('new peer', this._newPeer.bind(this))
}
// inherits from events module in order to trigger events
inherits(PatchBay, events)

// send data to all connected peers via data channels
PatchBay.prototype.sendToAll = function (data) {
  Object.keys(this.rtcPeers).forEach(function (id) {
    this.rtcPeers[id].send(data)
  }, this)
}

// sends to peer specified b
PatchBay.prototype.sendToPeer = function (peerId, data) {
  if (peerId in this.rtcPeers) {
    this.rtcPeers[peerId].send(data)
  }
}

PatchBay.prototype.reinitAll = function(){
  Object.keys(this.rtcPeers).forEach(function (id) {
    this.reinitPeer(id)
  }.bind(this))
//  this._connectToPeers.bind(this)
}

PatchBay.prototype.initRtcPeer = function(id, opts) {
  this.emit('new peer', {id: id})
  var newOptions = opts
  console.log()
  if(this.iceServers) {
    opts['config'] = {
      iceServers: this.iceServers
    }
  }

  if(opts.initiator === true) {
    if (this.stream != null) {
      if(this.settings.shareMediaWhenInitiating === true){
        newOptions.stream = this.stream
      }
    }
    if(this.settings.requestMediaWhenInitiating === true){
      newOptions.offerConstraints = {
        offerToReceiveVideo: true,
        offerToReceiveAudio: true
      }
    }
  } else {
    if(this.settings.shareMediaWhenRequested === true){
      if (this.stream != null) {
        newOptions.stream = this.stream
      }
    }
  }
  var options = extend(this._peerOptions, newOptions)
console.log("OPTIONS", options)
  this.rtcPeers[id] = new SimplePeer(options)
  this._attachPeerEvents(this.rtcPeers[id], id)
}

PatchBay.prototype.reinitRtcConnection = function(id, opts){
  // Because renegotiation is not implemeneted in SimplePeer, reinitiate connection when configuration has changed
  this.rtcPeers[id]._destroy(null, function(e){
      this.initRtcPeer(id, {
        stream: this.stream,
        initiator: true
      })
  }.bind(this))
}
// //new peer connected to signalling server
PatchBay.prototype._newPeer = function (peer){
    // this.connectedIds.push(peer)


    // Configuration for specified peer.
    // Individual configuration controls whether will receive media from
    // and/or send media to a specific peer.

    this.peers[peer] = {
      rtcPeer: null
    }

    this.emit('new peer', peer)
    // this.emit('updated peer list', this.connectedIds)
}
// // Once the new peer receives a list of connected peers from the server,
// // creates new simple peer object for each connected peer.
PatchBay.prototype._readyForSignalling = function ({ peers, servers }) {
//  console.log("received peer list", _t, this.peers)

  peers.forEach((peer) => {
    this._newPeer(peer)
  })

  // if received ice and turn server information from signalling server, use in establishing
  if(servers) {
    this.iceServers = servers
  }
//  this.peers = peers
  this.emit('ready')
}

// Init connection to RECEIVE video
PatchBay.prototype.initConnectionFromId = function(id, callback){
//  console.log("initianing connection")
  if(id in this.rtcPeers){
    console.log("Already connected to..", id, this.rtcPeers)
    //if this peer was originally only sending a stream (not receiving), recreate connecting but this time two-way
    if(this.rtcPeers[id].initiator===false){
      this.reinitRtcConnection(id)
    } else {
      //already connected, do nothing

    }
  } else {
    this.initRtcPeer(id, {
      initiator: true
    })
  }
}


// receive signal from signalling server, forward to simple-peer
PatchBay.prototype._handleMessage = function (data) {
  // if there is currently no peer object for a peer id, that peer is initiating a new connection.

  if (data.type === 'signal'){
    this._handleSignal(data)
  } else {
    this.emit('message', data)
  }
}
// receive signal from signalling server, forward to simple-peer
PatchBay.prototype._handleSignal = function (data) {
  // if there is currently no peer object for a peer id, that peer is initiating a new connection.
  if (!this.rtcPeers[data.id]) {
    // this.emit('new peer', data)
    // var options = extend({stream: this.stream}, this._peerOptions)
    // this.rtcPeers[data.id] = new SimplePeer(options)
    // this._attachPeerEvents(this.rtcPeers[data.id], data.id)

    this.initRtcPeer(data.id, {initiator: false})
  }
  this.rtcPeers[data.id].signal(data.message)
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
  //  this.signaller.emit('signal', {id: id, signal: signal})
    this.signaller.emit('message', {id: id, message: signal, type: 'signal'})
  }.bind(this, _id))

  p.on('stream', function (id, stream) {
    this.rtcPeers[id].stream = stream
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
    delete (this.rtcPeers[id])
    this.emit('close', id)
  }.bind(this, _id))

  p.on('error', function(e){
    console.log("simple peer error", e)
  })
}

PatchBay.prototype._destroy = function () {
  Object.values(this.rtcPeers).forEach( function (peer) {
    peer.destroy()
  })
  this.signaller.close()
}


module.exports = PatchBay
