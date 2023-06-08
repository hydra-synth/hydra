// load environmental variables contained in .env file
require('dotenv').config()

const fs = require('fs')
const express = require('express')
const app = express()
const path = require('path')
var http = require('http')
var server = http.createServer(app)
//
// TURN server access
var twilio = require('twilio')


if (process.env.TWILIO_SID) {
  var twilio_client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH)
}

var io = require('socket.io')(server)
require('./twitter-gallery.js')(app)

// create a server on port 8000
var httpsPort = process.env.HTTPS_PORT !== undefined ? process.env.HTTPS_PORT : 8000
server.listen(httpsPort, function () {
  console.log(`server available at http://localhost:${httpsPort}`)
})


io.on('connection', function (socket) {
  var thisRoom = null
  socket.on('join', function (room, _userData) {
    thisRoom = room

    var peers = io.nsps['/'].adapter.rooms[room] ? Object.keys(io.nsps['/'].adapter.rooms[room].sockets) : []

    if (twilio_client) {
      twilio_client.api.accounts(process.env.TWILIO_SID).tokens
        .create({})
        .then((token) => {
          //  console.log(token.iceServers)
          socket.emit('ready', {
            id: socket.id,
            // peers: peerUuids,
            peers: peers,
            servers: token.iceServers
          })

          socket.join(thisRoom)
          socket.to(thisRoom).emit('new peer', socket.id)
          socket.emit("peers", peers);

        })
    } else {
      socket.emit('ready', {
        id: socket.id,
        peers: peers
      })

      socket.join(thisRoom)
      socket.to(thisRoom).emit('new peer', socket.id)
      socket.emit("peers", peers);
    }

  })

  socket.on('broadcast', function (data) {
    socket.to(thisRoom).emit('broadcast', data)
  })

  // pass message from one peer to another
  socket.on('message', function (data) {
    var client = io.sockets.connected[data.id];
   
    client && client.emit('message', {
      id: socket.id,
      label: socket.label,
      type: data.type,
      message: data.message
    });
  })
})

app.use('/api', express.static(path.join(__dirname, '../frontend/hydra-functions/docs')))
app.use('/functions', express.static(path.join(__dirname, '../frontend/hydra-functions/docs')))
app.use('/docs', express.static(path.join(__dirname, '../frontend/hydra-docs')))
app.use('/garden', express.static(path.join(__dirname, '../frontend/hydra-garden/dist')))
app.use('/grants', express.static(path.join(__dirname, '../frontend/hydra-grants/public')))


app.use(express.static(path.join(__dirname, '../frontend/web-editor/public')))
