function track() {
  // add self to the scheduler, don't do anything else.
  var self = this;
  clock.addTrack(self);

  // our destination will be the last thing the audio goes through
  // before it is split.
  // self._destination = context.createGain();

  // stereo split at the end of the signal
  self._destination = context.createChannelSplitter(2);
  self._leftChannel = context.createGain();
  self._rightChannel = context.createGain();
  self._destination.connect(self._leftChannel, 1);
  self._destination.connect(self._rightChannel, 0);
  self._final = context.createChannelMerger(2);
  self._leftChannel.connect(self._final, 0, 1);
  self._rightChannel.connect(self._final, 0, 0);

  // self._destination.connect(self._split);
  self._final.connect(master.destination);

  // _schedulers is a convenience array that holds a reference to all of the
  // schedulers we feel like making. We're only going to have 1 default scheduler
  // for now, but this way you can push a new scheduler into _schedulers and
  // the clock will be able to tick it.
  self._schedulers = [];

  // _sequencers is a convenience array that holds a ref to all sequencers that
  // are triggered by the default beatPattern scheduler. If you're making a sequencer
  // and you want it to react to notes triggered by the beat pattern, just push it here.
  self._sequencers = [];

  // the beat pattern scheduler, more or less the backbone of the track.
  self._beatPattern = new Scheduler( function(nextTick) {
    // hit next on all of the track's sequencers
    for(var i = 0; i < self._sequencers.length; i++) {
      self._sequencers[i].next(nextTick);
    }
    // if the track has samples loaded, hit their sequencers too
    if(self._currentSample) {
      for(var i = 0; i < self._currentSample.sequencers.length; i++) {
        self._currentSample.sequencers[i].next(nextTick);
      }
    }
    // now do the sound stuff.
    self._makeNote(nextTick);
  });
  self._addScheduler(self._beatPattern);


  // here's some neatly packaged default functionality.
  // this would be a good example for third-party extensions.
  // in track.api.js you'll find that many of the api
  // calls are calling Sequencer.set() internally.

  // ---------------------------------------------------
  // keep track of the osc type and... sequence it???
  self._oscType = "sine";
  self._oscTypes = ["sine", "triangle", "square", "sawtooth"];
  self._oscTypeSequencer = new Sequencer( function(value, nextTick) {
    self._oscType = self._oscTypes[value];
  });
  self._attachSequencers(self._oscTypeSequencer);
  // ---------------------------------------------------


  // ---------------------------------------------------
  // let's make notes
  self._currentNote = 64;
  self._notesSequencer = new Sequencer( function(value) {
    self._currentNote = value;
  });
  self._attachSequencers(self._notesSequencer);
  // ---------------------------------------------------


  // ---------------------------------------------------
  // let's modulate the note length
  self._currentNoteLength = 2;
  self._noteLengthSequencer = new Sequencer( function(value) {
    self._currentNoteLength = value;
  });
  self._attachSequencers(self._noteLengthSequencer);
  // ---------------------------------------------------


  // ---------------------------------------------------
  // volume
  self._volume = 1;
  self._volumeSequencer = new Sequencer( function(value) {
    self._volume = value;
  });
  self._attachSequencers(self._volumeSequencer);
  // ---------------------------------------------------


  // ---------------------------------------------------
  // adsr envelope
  self._attack = 0.01;
  self._decay = 0;
  self._sustain = 1;
  self._release = 0.01;

  self._adsrSequencer = new Sequencer( function(value) {
    self._attack  = (typeof(value[0]) === 'number') ? value[0] : value[0]();
    self._decay   = (typeof(value[1]) === 'number') ? value[1] : value[1]();
    self._sustain = (typeof(value[2]) === 'number') ? value[2] : value[2]();
    self._release = (typeof(value[3]) === 'number') ? value[3] : value[3]();
  });
  self._attachSequencers(self._adsrSequencer);
  // ---------------------------------------------------


  // ---------------------------------------------------              - SAMPLES -
  // ---------------------------------------------------              -----------

  self._samples = [];
  self._currentSample = null;
  self._editingSample = null;

  // make a sequencer for the current sample.
  self._currentSampleSequencer = new Sequencer( function(value) {
    self._currentSample = self._samples[value];
  });
  self._attachSequencers(self._currentSampleSequencer);

  // ---------------------------------------------------             - STEREO MIX -
  // ---------------------------------------------------             --------------

  self._panSequencer = new Sequencer( function(value) {
    // -1 to 1 where (-1 to 0) is left mod and (0 to 1) is right mod
    if(value === 0) {
      self._leftChannel.gain.value = 1;
      self._rightChannel.gain.value = 1;
    } else if(value < 0) {
      self._leftChannel.gain.value = 1 + value;
      self._rightChannel.gain.value = 1;
    } else {
      self._leftChannel.gain.value = 1;
      self._rightChannel.gain.value = 1 - value;
    }
  });
  self._attachSequencers(self._panSequencer);

  // ---------------------------------------------------             - FILTER ENV -
  // ---------------------------------------------------             --------------

  // we're establishing reasonable defaults for a filter
  // envelope, but the filter won't be used unless
  // one is invoked on the track.
  self._filterEnvAttack = 0;
  self._filterEnvDecay = 0;
  self._filterEnvSustain = 1;
  self._filterEnvRelease = 0;
  self._filterEnvAmt = 0;

  self._filterType = null;
  self._filterFrequency = null;
  self._filterRes = null;

  self._filterIsActive = false;

  self._filterFrequencySequencer = new Sequencer( function(value) {
    self._filterFrequency = value;
  });

  self._filterResSequencer = new Sequencer( function(value) {
    self._filterRes = value;
  });

  self._filterEnvAmtSequencer = new Sequencer( function(value) {
    self._filterEnvAmt = value;
  });

  // allow the envelope to be changed each beat
  self._filterEnvelopeSequencer = new Sequencer( function(value) {
    self._filterEnvAttack = value[0];
    self._filterEnvDecay = value[1];
    self._filterEnvSustain = value[2];
    self._filterEnvRelease = value[3];
  });

  self._attachSequencers(
    self._filterFrequencySequencer,
    self._filterResSequencer,
    self._filterEnvAmtSequencer,
    self._filterEnvelopeSequencer
  );

  // ---------------------------------------------------            - WEIRD  STUFF -
  // ---------------------------------------------------            ----------------

  self._evalSequencer = new Sequencer( function(statement) {
    // accept empty strings as `skips`
    if(!statement){
      return;
    }
    eval('self.' + statement);
  });
  self._attachSequencers(self._evalSequencer);


  // `track.in` setup

  // make a scheduler that listens to 16th ticks
  self._inQueue = [];
  self._inScheduler = new Scheduler( function(nextTick) {
    for(var i = self._inQueue.length - 1; i >= 0; i--) {
      self._inQueue[i]._next();
    }
  });
  self._addScheduler(self._inScheduler);
  self._inScheduler.set([1], 16);

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
        self[inSelf.queue[i].action].apply(self, inSelf.queue[i].args);
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

    // when `in` is called, break out of the `_in` queue
    // and create a new instance of `_in` on the track
    // with the combined time.
    self._in.prototype['in'] = function(count) {
      var inSelf = this;
      return self.in(count + inSelf.count);
    };
  });

  // ---------------------------------------------------            -   DESTROY   -
  // ---------------------------------------------------            ---------------

  self._destroy = function() {
    // tell `clock` to remove this track
    // from all bookkeeping.
    clock._destroyTrack(self);
    clock._removeTrackFromGroups(self);
  };

  // ---------------------------------------------------            -    STATE    -
  // ---------------------------------------------------            ---------------

  // keep track of current state!
  self._state = {};
  self._stateProps = {};

  self._setState = function(fn, args) {
    var self = this;
    if(args.length === 0 && self._state[fn]) {
      delete self._state[fn];
    } else if(args.length > 0) {
      self._state[fn] = args;
    }
  };

  self._removeState = function(fn) {
    if(self._state[fn]) {
      delete self._state[fn];
    }
  };

  self._setStateProperty = function(prop, value) {
    var self = this;
    self._stateProps[prop] = value;
  };

  self._applyState = function(functionState, propertyState) {
    // functions
    for(var fn in functionState) {
      self[fn].apply(self, functionState[fn]);
    }
    // properties
    for(var prop in propertyState) {
      self[prop] = propertyState[prop];
    }
  };

  // ---------------------------------------------------            - SOUND CHAIN -
  // ---------------------------------------------------            ---------------

  self._chain = [];

  // events for the event handler system!
  self._events = {};


  // ---------------------------------------------------            -   SAMPLE?   -
  // ---------------------------------------------------            ---------------

  // if there are arguments they are samples!
  if(arguments.length) {
    self.sample.apply(self, arguments);
  }

  return self;
}

// sticking with the `arguments` theme, let's allow
// multiple sequencers to be added at once.
track.prototype._attachSequencers = function() {
  for(var i = 0; i < arguments.length; i++) {
    this._sequencers.push(arguments[i]);
  }
}

// likewise, allow multiple sequencers to be
// detached in one call. this will be nice for
// effects that have to dump their sequencers
// when they are turned off.
track.prototype._detachSequencers = function() {
  for(var i = 0; i < arguments.length; i++) {
    var index = this._sequencers.indexOf(arguments[i]);
    if(index > -1) {
      this._sequencers.splice(index, 1);
      continue;
    }
  }
}

track.prototype._addScheduler = function(newScheduler) {
  this._schedulers.push(newScheduler);
}

track.prototype._detachSchedulers = function() {
  for(var i = 0; i < arguments.length; i++) {
    var index = this._schedulers.indexOf(arguments[i]);
    if(index > -1) {
      this._schedulers.splice(index, 1);
      continue;
    }
  }
}

track.prototype._addSequencer = function(newSequencer) {
  this._beatPatternSequencers.push(newSequencer);
}

track.prototype._makeNote = function(nextTick) {
  var self = this;

  // cool thing about this makeNote function: since we set up sequencers for everything,
  // all of the parameters we're going to use have already been modulated.
  // that means we can just call them here and know that their values have been set
  // according to whatever is currently on the playing field.

  var noteStart = nextTick;
  var noteEnd = nextTick + (self._currentNoteLength * clock.noteLength());

  if(self._samples.length) {
    // _makeSampler is implemented in track.sampler.js
    self._makeSampler(noteStart, noteEnd);
  } else {
    // _makeOscillator is implemented in track.oscillator.js
    self._makeOscillator(noteStart, noteEnd);
  }
}

track.prototype._connectToChain = function(sound) {
  var self = this;
  if(self._chain.length) {
    sound.connect(self._chain[0].input);
  } else {
    // check channels,
    // sound.connect(self._destination);
    self._connectToDestination(sound);
  }
}

track.prototype._connectToDestination = function(sound) {
  var self = this;
  // check channels and connect accordingly.
  if(sound.numberOfOutputs == 1 && sound.numberOfChannels < 2) {
    // disconnect the destination and connect directly to _leftChannel and _rightChannel.
    self._destination.disconnect();
    sound.connect(self._leftChannel);
    sound.connect(self._rightChannel);
  } else {
    // reconnect destination in case it's unplugged
    // (this is ignore in the case that it's already connected)
    // and carry on.
    self._destination.connect(self._leftChannel, 0);
    self._destination.connect(self._rightChannel, 1);
    sound.connect(self._destination);
  }
}

// the chain only manages connections- not the effects themselves.

track.prototype._addToChain = function(input, output) {
  var self = this;
  var newEffect = new trackEffect(input, output, generateId());
  self._chain.push(newEffect);
  // connect the second-to-last effect to the new one
  if(self._chain.length > 1) {
    var penUltimate = self._chain.length - 2;
    var ultimate = self._chain.length - 1;
    self._chain[ penUltimate ].output.disconnect();
    self._chain[ penUltimate ].output.connect( self._chain[ ultimate ].input );
    // self._chain[ ultimate ].output.connect( self._destination );
    self._connectToDestination( self._chain[ ultimate ].output );
  } else {
    // self._chain[0].output.connect( self._destination );
    self._connectToDestination( self._chain[0].output );
  }
  // return an index so we can call _removeFromChain later if we want
  return newEffect.id;
}

track.prototype._removeFromChain = function(id) {
  var self = this;

  var index = null;
  for(var i = 0; i < self._chain.length; i++) {
    if(self._chain[i].id === id) {
      index = i;
      break;
    }
  }

  if(index === null) {
    // console.log('An error occurred removing an effect from the chain with id', id, index);
    return;
  }

  // disconnect the effect at index-1 if it exists,
  // slice out the effect at index,
  // reroute index-1 to the effect now at index (if one exists; else self._destination)
  if(index > 0) {
    self._chain[index - 1].output.disconnect();
  }

  self._chain.splice(index, 1);

  // if the thing we just removed had a left and right sibling, connect them
  if(index > 0 && index < self._chain.length) {
    self._chain[index - 1].output.connect(self._chain[index].input);
  }
  // or, if the thing we removed was the last in line, connect the left sibling to self.destination
  else if(index > 0 && index == self._chain.length) {
    // self._chain[index - 1].output.connect( self._destination );
    self._connectToDestination( self._chain[index - 1].output );
  }

  // otherwise, the chain is empty and no action is necessary.

  return null;
}

function trackEffect(input, output, id) {
  var self = this;
  self.input = input;
  self.output = output;
  self.id = id;
}

var generateId = function () {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
};