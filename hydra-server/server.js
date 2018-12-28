// load environmental variables contained in .env file
require('dotenv').config()

const fs = require('fs')
const express = require('express')
const app = express()
const browserify = require('browserify-middleware')
const multer = require('multer')
const tweet = require('./tweet.js')

//const https = require('https')
var server;
const path = require('path')
const Datastore = require('nedb')
  db = new Datastore({ filename: './hydra-server/db/saved_sketches', autoload: true})

// check whether on glitch. If on glitch, use http because glitch automatically creates https.
if(process.env.GLITCH) {
  var http = require('http')
  server = http.createServer(app)

  function checkHttps(req, res, next){
  // protocol check, if http, redirect to https
  //console.log("accessing page!", req.params, req.url)
  if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
     // console.log("https, yo")
      return next()
    } else {
      console.log("just http")
      res.redirect('https://' + req.hostname + req.url);
    }
  }

  app.all('*', checkHttps)
} else {
  var https = require('https')
  var privateKey = fs.readFileSync(path.join(__dirname, '/certs/key.pem'), 'utf8')
  var certificate = fs.readFileSync(path.join(__dirname, '/certs/certificate.pem'), 'utf8')

  var credentials = {key: privateKey, cert: certificate}
  server = https.createServer(credentials, app)
}

// TURN server access
var twilio = require('twilio')
require('dotenv').config()

//console.log('process', process.env)

if(process.env.TWILIO_SID) {
  var twilio_client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH)
}



var io = require('socket.io')(server)

var sketches = []

db.count({}, function (err, count) {
  console.log("There are " + count + " users in the database");
  if(err) console.log("There's a problem with the database: ", err);
  else if(count<=0){ // empty database so needs populating
    // default users inserted in the database
    db.insert(sketches, function (err, testAdded) {
      if(err) console.log("There's a problem with the database: ", err);
      else if(testAdded) console.log("Default users inserted in the database");
    });
  }
});

app.get('/sketches', function (request, response) {
  db.find({}, function (err, entries){
    if (err) {
      console.log('problem with db', err)
    } else {
      var res = entries.map((entry) => {
        entry.sketch_id = entry._id
        return entry
      })
      response.send(entries)
    }
  })
})

app.post('/sketch', function (request, response) {
  console.log('post sketch', request.query)
  db.insert({
    "code": request.query.code,
    "parent": request.query.parent,
    "date": new Date()
  }, function (err, sketchAdded) {
    if (err) {
      console.log('error adding', err)
      response.sendStatus(500)
    } else {
      console.log('ADDED', sketchAdded)
      response.send(sketchAdded._id)
    }
  })
})

// app.post('/image', function (request, response) {
//   console.log('post sketch', request.query)
// })

tweet.hello_world()

//const storage = multer.memoryStorage();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
   cb(null, path.join(__dirname + '/uploads/'))
   },
   filename: function (req, file, cb) {
     cb(null, file.originalname + '.png')
   }
})

 const upload = multer({ storage: storage });
 app.post("/image", upload.single('previewImage'), (req, res) => {
   console.log(req.file);
   // tweet.post_image('testing', req.file.buffer, function (err) {
   //   console.log('UPLOADED', err)
   // })
  // saveFile(req.file, "test.png")
   tweet.post_chunked('test', req.file.path)
   res.status(200).send( true );
   res.end();
 });

 function saveFile(body, fileName) {
   const file = fs.createWriteStream(fileName)
   request(body).pipe(file).on('close', err => {
     if (err) {
       console.log(err)
     } else {
       console.log('Media saved!')
       const descriptionText = body.title
      // uploadMedia(descriptionText, fileName)
     }
   })
 }

app.get('/bundle.js', browserify(path.join(__dirname, '/app/index.js')))
app.get('/camera-bundle.js', browserify(path.join(__dirname, '/app/camera.js')))
// crear un servidor en puerto 8000
server.listen(8000, function () {
  // imprimir la direccion ip en la consola
  // console.log('servidor disponible en https://'+myip.getLocalIP4()+':8000')
  console.log('server available at https://localhost:8000')
})

// look up uuid by entiring socket id
var userFromSocket = {}

// lookup socket id by entering uuid
var socketFromUser = {}

var networkArray = []
// new connection to websocket server
io.on('connection', function (socket) {
  console.log('new connection', socket.id)
  var thisRoom = null
  socket.on('join', function (room, _userData) {
    thisRoom = room
    console.log('user', JSON.stringify(_userData))
    if (_userData.uuid) {
      userFromSocket[socket.id] = _userData.uuid
      socketFromUser[_userData.uuid] = socket.id
    } else {
      console.log('no user data!')
    }
    // Get the list of peers in the room
    var peers = io.nsps['/'].adapter.rooms[room] ? Object.keys(io.nsps['/'].adapter.rooms[room].sockets) : []

    io.of('/').in(room).clients(function (error, clients) {
      if (error) throw error
      console.log(clients) // => [Anw2LatarvGVVXEIAAAD]
    })

    var peerUuids = peers.map(socketId => userFromSocket[socketId])

    // Send them to the client
  //  socket.emit('ready', socket.id, peerUuids)
    if(twilio_client) {
      twilio_client.api.accounts(process.env.TWILIO_SID).tokens
      .create({})
      .then((token) => {
          //  console.log(token.iceServers)
            socket.emit('ready', {
              id: socket.id,
              peers: peerUuids,
              servers: token.iceServers
            })
          })
    } else {
      socket.emit('ready', {
        id: socket.id,
        peers: peerUuids
      })
    }

    // And then add the client to the room
    socket.join(room)

    // send updated list of peers to all clients in room
    // io.sockets.emit('peers', peerUuids);
    socket.to(thisRoom).emit('new peer', _userData.uuid)

    console.log('user', JSON.stringify(Object.keys(socketFromUser)))
  })

  socket.on('broadcast', function (data) {
    // io.sockets.emit('broadcast', data)
    console.log('broadcasting', data, socket.room)
    //  io.sockets.in(socket.room).emit('broadcast', data)
    socket.to(thisRoom).emit('broadcast', data)
  })

  // pass message from one peer to another
  socket.on('message', function (data) {
    var client = io.sockets.connected[socketFromUser[data.id]]
    client && client.emit('message', {
      id: userFromSocket[socket.id],
      label: socket.label,
      message: data.message,
      type: data.type
    })
  })

  socket.on('signal', function (data) {
    console.log('forwarding signal ' + JSON.stringify(data))
    var client = io.sockets.connected[socketFromUser[data.id]]
    client && client.emit('signal', {
      id: userFromSocket[socket.id],
      label: socket.label,
      signal: data.signal
    })
  })
  // TO DO: on disconnect, remove from label dictionary
})

app.use(express.static(path.join(__dirname, '/public')))
