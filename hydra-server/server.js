//incluir otros librerias y modulos
var fs = require('fs');
var express = require('express')
var app = express();
var browserify = require('browserify-middleware')
var myip = require('quick-local-ip');
var https = require('https')

//Usar certificado y key para crear un servidor con conexion encryptado
var privateKey  = fs.readFileSync(__dirname + '/certs/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname +'/certs/certificate.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
//iniciar el servidor
var httpsServer = https.createServer(credentials, app);

//iniciar los websockets en el servidor
var io = require('socket.io')(httpsServer);

app.get('/bundle.js', browserify(__dirname + '/app/index.js'));
app.get('/camera-bundle.js', browserify(__dirname + '/app/camera.js'));
//crear un servidor en puerto 8000
httpsServer.listen(8000, function(){
  //imprimir la direccion ip en la consola
  //console.log("servidor disponible en https://"+myip.getLocalIP4()+":8000")
  console.log("server available at https://localhost:8000")

});

//look up uuid by entiring socket id
var userFromSocket = {}

//lookup socket id by entering uuid
var socketFromUser = {}

//new connection to websocket server
io.on('connection', function (socket) {
   console.log("new connection", socket.id)
   var thisRoom = null

     socket.on('join', function(room, _userData) {
      thisRoom = room

       console.log("user", JSON.stringify(_userData))
       if(_userData.uuid){
         userFromSocket[socket.id] = _userData.uuid
         socketFromUser[_userData.uuid] = socket.id
       } else {
         console.log("no user data!")
       }
      // Get the list of peers in the room
      var peers = io.nsps['/'].adapter.rooms[room] ?
                Object.keys(io.nsps['/'].adapter.rooms[room].sockets) : []

      io.of('/').in(room).clients(function(error, clients){
        if (error) throw error;
      console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
}    );

      var peerUuids = peers.map(function(socketId){
        return userFromSocket[socketId]
      })

        // Send them to the client
      socket.emit('ready', socket.id, peerUuids)

       // And then add the client to the room
      socket.join(room);

    //send updated list of peers to all clients in room
     // io.sockets.emit('peers', peerUuids);
      socket.to(thisRoom).emit('new peer', _userData.uuid)

    });


      socket.on('broadcast', function(data){
        // io.sockets.emit('broadcast', data)
        console.log("broadcasting", data, socket.room)
      //  io.sockets.in(socket.room).emit('broadcast', data)
        socket.to(thisRoom).emit('broadcast', data)

      })

     socket.on('signal', function(data) {
       console.log("forwarding signal " + JSON.stringify(data))
      var client = io.sockets.connected[socketFromUser[data.id]];
      client && client.emit('signal', {
        id: userFromSocket[socket.id],
        label: socket.label,
        signal: data.signal,
      });
    });


    ///TO DO: on disconnect, remove from label dictionary
});
//
// //nueva conexion al servidor de websockets
// io.on('connection', function (socket) {
//
//
//      socket.on('join', function(room) {
//       // Get the list of peers in the room
//       var peers = io.nsps['/'].adapter.rooms[room] ?
//                 Object.keys(io.nsps['/'].adapter.rooms[room].sockets) : []
//
//       // Send them to the client
//       socket.emit('peers', peers);
//       // And then add the client to the room
//       socket.join(room);
//     });
//
//
//      socket.on('signal', function(data) {
//       var client = io.sockets.connected[data.id];
//       client && client.emit('signal', {
//         id: socket.id,
//         signal: data.signal,
//       });
//     });
//
//
//
// });


app.use(express.static(__dirname +'/public'));
