// Module for handling connections to multiple peers

var extend = Object.assign
var PatchBay = require('./rtc-patch-bay.js')
var inherits = require('inherits')

var PBExtended = function (options) {

  PatchBay.call(this, options)
}
// inherits from PatchBay module
inherits(PBExtended, PatchBay)

PBExtended.prototype.setNick = function(nick) {
  this.nick = nick
  document.title = nick
}

// PBExtended.prototype.
module.exports = PBExtended
