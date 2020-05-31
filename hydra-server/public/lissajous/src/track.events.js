track.prototype._on = function(type, id, fn) {
  var self = this;
  if(self._events[type] && self._events[type].length) {
    self._events[type].push({ fn: fn, id: id, keep: true });
  } else {
    self._events[type] = [{ fn: fn, id: id, keep: true }];
  }
}

track.prototype._once = function(type, id, fn) {
  var self = this;
  if(self._events[type] && self._events[type].length) {
    self._events[type].push({ fn: fn, id: id, keep: false });
  } else {
    self._events[type] = [{ fn: fn, id: id, keep: false }];
  }
}

track.prototype._emit = function(type, data) {
  var self = this;
  if(self._events[type] && self._events[type].length) {
    for(var i = self._events[type].length - 1; i >= 0; i--) {
      self._events[type][i].fn(data);
      // if we're not keeping it around, ditch it!
      if(self._events[type][i] && !self._events[type][i].keep) {
        self._events[type] = self._events[type].splice(i, 1);
      }
    }
  }
}

track.prototype._off = function(type, id) {
  var self = this;
  if(self._events[type] && self._events[type].length) {
    // get the index of the event using its id
    var index = null;
    for(var i = 0; i < self._events[type].length; i++) {
      if(self._events[type][i].id == id) {
        index = i;
        break;
      }
    }
    if(index !== null) {
      self._events[type].splice(index, 1);
    }
  }
}