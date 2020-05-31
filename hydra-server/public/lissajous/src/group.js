// Arbitrarily group several tracks and call the track API
// on all of them at the same time! A feat of computer science.

// this is hefty only because `group.in` required a new,
// more complicated implementation of `track.in` where
// the group contains a scheduler, listens for ticks,
// and calls the queue on each track in its array.
// the only difference should be in the `_run` function.

function group() {
  var self = this;
  self.tracks = Array.prototype.slice.call(arguments);

  // make a scheduler that listens to 16th ticks
  self._schedulers = [];
  self._inQueue = [];
  self._inScheduler = new Scheduler( function(nextTick) {
    // console.log('group is listening to ticks!');
    for(var i = self._inQueue.length - 1; i >= 0; i--) {
      self._inQueue[i]._next();
    }
  });
  self._inScheduler.set([1], 16);
  self._schedulers.push(self._inScheduler);

  clock.addGroup(self);


  // add one or more tracks to the group after it has been instantiated
  self.add = function() {
    var args = Array.prototype.slice.call(arguments);
    self.tracks = self.tracks.concat(args);
    return self;
  };

  // remove a track by reference, e.g. group.remove(t1); where t1 = new track()
  self.remove = function() {
    var args = Array.prototype.slice.call(arguments);
    args.forEach( function(t) {
      self.tracks.splice( self.tracks.indexOf(t), 1 );
    });
    return self;
  };

  // apply different beat patterns to the tracks in the group
  // e.g. group.beats([2, 4, 6], [6, 7, 8])
  // track1 --> [2, 4, 6]
  // track2 --> [6, 7, 8]
  // track3 --> [2, 4, 6]
  // and so on ...
  self.beats = function () {
    var args = Array.prototype.slice.call(arguments);
    if(args.length > 0) {
      var i = 0;
      self.tracks.forEach( function (t) {
        t.beat(args[i]);
        i = (i + 1) % args.length;
      });
    } else {
      self.tracks.forEach( function (t) {
        t.beat();
      });
    }
    return self;
  };


  // =============================================================== `_in` stuff

  // the public `in` function returns a new instance of self._in
  self._in = function(count) {
    var inSelf = this;
    // attach this new instance to the track's queue of active `in` requests
    self._inQueue.push(inSelf);

    // each `in` requests gets its own queue of functions
    // (in order to support the chainable API)
    inSelf.queue = [];
    inSelf.count = count;
    // `_` is a reference to the track, which allows us to
    // pop back out of the in queue via the API,
    // e.g. `t.in(32).notes(64,63,62)._.beat(2)`, which sets
    // the beat to `2` now and changes the notes in 32 steps
    inSelf._ = self;

    // `_run` calls the internal queue of functions with their arguments
    inSelf._run = function() {
      for(var i = 0; i < inSelf.queue.length; i++) {
        // call the function with its arguments
        for(var j = 0; j < self.tracks.length; j++) {
          self.tracks[j][inSelf.queue[i].action].apply(self.tracks[j], inSelf.queue[i].args);
        }
      }
      self._inQueue.splice(self._inQueue.indexOf(inSelf), 1);
    };

    // `_next` counts the steps passed until it's time to run
    inSelf._next = function() {
      inSelf.count -= 1;
      if(inSelf.count === 0) {
        inSelf._run();
      }
    };
    return inSelf;
  };

  // grab the fields of the public API we want to mirror,
  // except `in` which we have to override
  var _publicApiFields = [];
  for(var field in track.prototype) {
    if(field.substr(0,1) !== '_' && field !== 'in') {
      _publicApiFields.push(field);
    }
  }

  // add each function to the `_in` prototype,
  // which stores the function that was called and its arguments.
  _publicApiFields.forEach( function(field) {
    self._in.prototype[field] = function() {
      var inSelf = this;
      inSelf.queue.push({
        action: field,
        args: arguments
      });
      return inSelf;
    };
  });

  // when `in` is called, break out of the `_in` queue
  // and create a new instance of `_in` on the track
  // with the combined time.
  self._in.prototype['in'] = function(count) {
    var inSelf = this;
    return self.in(count + inSelf.count);
  };

  // =============================================================== `_in` stuff

  return self;

}

// don't expose these variables to the window
( function() {
  var _groupFields = [];
  for(var field in track.prototype) {
    if(field.substr(0,1) !== '_' && field !== 'in') {
      _groupFields.push(field);
    }
  }

  _groupFields.forEach( function(item) {
    group.prototype[ item ] = function() {
      var self = this;
      var args = Array.prototype.slice.call(arguments);
      this.tracks.forEach( function(t) {
        t[ item ].apply(t, args);
      });
      return self;
    };
  });

  group.prototype['in'] = function(count) {
    return new this._in(count);
  };
})();

// group has a different implementation of `sync`
group.prototype.sync = function () {
  var self = this;
  var args = _parseArguments(arguments);

  self.tracks.forEach( function (t) {
    t._beatPattern.zero();
  });

  // if tracks outside of this group were passed in,
  // sync those up as well.
  args.forEach( function (t) {
    t._beatPattern.zero();
  });

  return self;
};