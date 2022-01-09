const fs = require('fs')
const path = require('path')

// if on glitch, force https
module.exports = (app) => {
  var server
  if(process.env.GLITCH) {
    var http = require('http')
    server = http.createServer(app)

    function checkHttps(req, res, next){
    if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
       // console.log("https, yo")
        return next()
      } else {
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
  return server
}
