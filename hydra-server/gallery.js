// server-side code related to saving and storing images


// if has twitter key, enamble uploading
if(process.env.CONSUMER_KEY) {
  const tweet = require('./tweet.js')
}

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
