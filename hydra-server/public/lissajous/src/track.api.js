// This is the performance API.
// Golden Rule: everything starts with `var self = this` and ends with `return self`.

function _joinArgs(args) {
  args = Array.prototype.slice.call(args);
  for(var i = 1; i < args.length; i++) {
    args[0] = args[0].concat(args[i]);
  }
  return args[0];
}

// _parseArguments takes multiple array arguments and stitches them into a one-dimensional array.
// function _parseArguments(args) {
//   if(Array.isArray(args[0])) {
//     args = _joinArgs(args);
//   }
//   return args;
// }

// new method of array flattening
function _parseArguments(args) {
  args = Array.prototype.slice.call(args);
  var flattened = [];
  args.forEach( function(item) {
    flattened = flattened.concat(item);
  });
  return flattened;
}

// ------------------------------------------------------------------ BASICS

track.prototype.destroy = function() {
  var self = this;
  self._destroy();
  return self;
};

track.prototype.beat = function() {
  var self = this;
  var arguments = _parseArguments(arguments);
  self._beatPattern.set(arguments, 16);
  self._setState('beat', arguments);
  return self;
};

track.prototype.beat32 = function() {
  var self = this;
  var arguments = _parseArguments(arguments);
  self._beatPattern.set(arguments, 32);
  self._setState('beat32', arguments);
  return self;
};

track.prototype.notes = function() {
  var self = this;
  // let's allow an array of notes as well
  var arguments = _parseArguments(arguments);
  self._notesSequencer.set(arguments);
  if(arguments.length == 0) {
    self._currentNote = 64;
  }
  self._setState('notes', arguments);
  return self;
};

track.prototype.nl = function() {
  var self = this;
  var arguments = _parseArguments(arguments);
  self._setState('nl', arguments);

  var resolutionModifier = clock.bpmResolution / 16;

  function modify(arg) {
    if(typeof(arg) === 'number') {
      return arg * resolutionModifier;
    } else if(typeof(arg) === 'function') {
      // wrap the callback in our own that multiplies it by the res modifier
      return function() {
        return arg() * resolutionModifier;
      };
    }
  }

  if(arguments.length) {
    // nl will be 16th notes, so we need to multiply everything by 2
    for(var i = 0; i < arguments.length; i++) {
      arguments[i] = modify(arguments[i]);
    }
  } else {
    // reasonable default -> nl = 16th note
    self._currentNoteLength = 2;
  }
  self._noteLengthSequencer.set(arguments);
  return self;
};

track.prototype.nl32 = function() {
  var self = this;
  var arguments = _parseArguments(arguments);
  self._setState('nl32', arguments);

  self._noteLengthSequencer.set(arguments);
  if(arguments.length == 0) {
    // reasonable default -> nl = 16th note
    self._currentNoteLength = 2;
  }
  return self;
};

track.prototype.trans = function(semitones) {
  var self = this;
  // if there were no notes, set them to the default ([64])
  if(!self._notesSequencer.pattern.length) {
    self._notesSequencer.set([64]);
  }
  for(var i = 0; i < self._notesSequencer.pattern.length; i++) {
    if(typeof self._notesSequencer.pattern[i] !== 'function') {
      self._notesSequencer.pattern[i] = self._notesSequencer.pattern[i] + semitones;
    } else {
      // if it's a function, decorate it in a new function that translates it.
      var originalCb = self._notesSequencer.pattern[i];
      self._notesSequencer.pattern[i] = function() {
        return originalCb() + semitones;
      };
    }
  }
  // since state is order-independent we'll need to
  // (re)set the `notes` state with absolute values.
  self._setState('notes', self._notesSequencer.pattern);
  return self;
};

track.prototype.shift = function(amount) {
  var self = this;
  self._schedulers[0].untilNextBeat += amount;
  if(self._schedulers[0].untilNextBeat < 0) {
    self._schedulers[0].untilNextBeat = 0;
  }
  return self;
};

// -1 is left, 1 is right, 0 is center
track.prototype.pan = function() {
  var self = this;
  var arguments = _parseArguments(arguments);
  self._panSequencer.set(arguments);
  if(arguments.length == 0) {
    self._panSequencer.set([0]);
  }
  self._setState('pan', arguments);
  return self;
};

// ------------------------------------------------------------------ OSCILLATORS

track.prototype.sine = function() {
  var self = this;
  if(self._oscTypeSequencer.pattern.length) {
    // clear the oscType sequencer if it had a pattern
    self._oscTypeSequencer.set([]);
  }
  self._oscType = "sine";
  self._setStateProperty('_oscType', "sine");
  return self;
};

track.prototype.square = function() {
  var self = this;
  if(self._oscTypeSequencer.pattern.length) {
    // clear the oscType sequencer if it had a pattern
    self._oscTypeSequencer.set([]);
  }
  self._oscType = "square";
  self._setStateProperty('_oscType', "square");
  return self;
};

track.prototype.saw = function() {
  var self = this;
  if(self._oscTypeSequencer.pattern.length) {
    // clear the oscType sequencer if it had a pattern
    self._oscTypeSequencer.set([]);
  }
  self._oscType = "sawtooth";
  self._setStateProperty('_oscType', "sawtooth");
  return self;
};

track.prototype.tri = function() {
  var self = this;
  if(self._oscTypeSequencer.pattern.length) {
    // clear the oscType sequencer if it had a pattern
    self._oscTypeSequencer.set([]);
  }
  self._oscType = "triangle";
  self._setStateProperty('_oscType', "triangle");
  return self;
};

// oscillator type sequencer! 0 to 3 or SINE, SQUARE, TRIANGLE, SAWTOOTH
track.prototype.type = function() {
  var self = this;
  var arguments = _parseArguments(arguments);
  self._oscTypeSequencer.set(arguments);
  if(arguments.length == 0) {
    self._oscType = "sine";
  }
  self._setState('type', arguments);
  return self;
};

// ------------------------------------------------------------------ ENVELOPE

track.prototype.vol = function() {
  var self = this;
  var arguments = _parseArguments(arguments);
  self._volumeSequencer.set(arguments);
  if(arguments.length == 0) {
    self._volume = 0;
  }
  self._setState('vol', arguments);
  return self;
};

track.prototype.adsr = function() {
  var self = this;
  var resolutionModifier = clock.bpmResolution / 16;
  // arguments isn't really an array so we have to turn it into one
  var arguments = Array.prototype.slice.call(arguments);
  // arguments = _parseArguments(arguments);
  self._applyAdsrArguments(arguments, resolutionModifier);
  self._setState('adsr', arguments);
  return self;
};

track.prototype.adsr32 = function() {
  var self = this;
  var resolutionModifier = clock.bpmResolution / 32;
  // arguments isn't really an array so we have to turn it into one
  var arguments = Array.prototype.slice.call(arguments);
  // arguments = _parseArguments(arguments);
  self._applyAdsrArguments(arguments, resolutionModifier);
  self._setState('adsr32', arguments);
  return self;
};

track.prototype._applyAdsrArguments = function(args, resolutionModifier) {
  var self = this;

  // a helper function
  function modify(arg) {
    if(typeof(arg) === 'number') {
      return arg * resolutionModifier;
    } else if(typeof(arg) === 'function') {
      // wrap the callback in our own that multiplies it by the res modifier
      return function() {
        return arg() * resolutionModifier;
      };
    }
  }

  // if we get an array as a first argument, we will assume all args are arrays.
  if(args.length > 0 && Array.isArray(args[0])) {
    args = args.map( function(arg) {
      // for some reason these were refs to the same array or something?
      arg = Array.prototype.slice.call(arg);
      // we don't want silly errors
      if(arg.length < 4) {
        return [0, 0, 1 * resolutionModifier, 0];
      }
      arg[0] = modify(arg[0]);
      arg[1] = modify(arg[1]);
      // sustain does not get modified
      arg[3] = modify(arg[3]);
      return arg;
    });
    self._adsrSequencer.set(args);
  }
  // ...or it's just four values.
  else if(args.length == 4) {
    args[0] = modify(args[0]);
    args[1] = modify(args[1]);
    // sustain does not get modified
    args[3] = modify(args[3]);
    self._adsrSequencer.set([args]);
  }
  // back to the defaults
  else {
    self._attack = self._decay = self._release = 0;
    self._sustain = 1;
    self._adsrSequencer.set([]);
  }
};

// ------------------------------------------------------------------ SAMPLER

// sample buffers
track.prototype.sample = function() {
  var self = this;
  self._samples = [];
  var arguments = Array.prototype.slice.call(arguments);
  arguments = _parseArguments(arguments);
  arguments.forEach( function(buffer) {
    self._samples.push( new Sample(buffer) );
  });
  if(arguments.length) {
    self._currentSample = self._samples[0];
    self._editingSample = self._samples[0];
  }
  self._setState('sample', arguments);
  return self;
};

track.prototype.play = function(overflow) {
  var self = this;
  if(self._editingSample) {
    // reset the current sample
    self._editingSample.defaultParams();
    // reset the beat, note length, adsr
    var beatLength = self._editingSample.getBeatLength(overflow);
    self.beat32(beatLength);
    self.nl(beatLength);
    self.adsr();
    self.sseq( self._samples.indexOf(self._editingSample) );
  }
  return self;
};

track.prototype.addsamples = function() {
  var self = this;
  var arguments = Array.prototype.slice.call(arguments);
  arguments.forEach( function(buffer) {
    self._samples.push( new Sample(buffer) );
  });
  self._setState('addsamples', arguments);
  return self;
};

track.prototype.select = function(index) {
  var self = this;
  if(index < self._samples.length) {
    self._editingSample = self._samples[index];
  }
  self._setStateProperty('_editingSample', arguments);
  return self;
};

// sample sequence
track.prototype.sseq = function() {
  var self = this;
  var arguments = _parseArguments(arguments);

  // safeguard against errors for indices past the available length
  for(var i = 0; i < arguments.length; i++) {
    if(arguments[i] >= self._samples.length && typeof(arguments[i]) === 'number') {
      arguments[i] = self._samples.length - 1;
    }
  }
  self._currentSampleSequencer.set(arguments);
  self._setState('sseq', arguments);
  return self;
};

track.prototype.clamp = function(start, end) {
  var self = this;
  if(self._editingSample) {
    if(arguments.length === 0) {
      self._editingSample.loopStart = 0;
      self._editingSample.loopEnd = 1;
    }
    else if(end === undefined) {
      self._editingSample.loopStart = 0;
      self._editingSample.loopEnd = start;
    } else {
      self._editingSample.loopStart = start;
      self._editingSample.loopEnd = end;
    }
  }
  // self._setState('clamp', arguments);
  return self;
};

track.prototype.cs = track.prototype.clshift = function() {
  var self = this;
  if(self._editingSample) {
    var arguments = _parseArguments(arguments);
    self._editingSample.clampShiftSequencer.set(arguments);
  }
  // self._setState('cs', arguments);
  return self;
};

track.prototype.loop = function() {
  var self = this;
  if(self._editingSample) {
    if(arguments.length && arguments[0]) {
      self._editingSample.looping = true;
    } else {
      self._editingSample.looping = false;
    }
  }
  return self;
};

track.prototype.stretch = function() {
  var self = this;
  resolutionModifier = clock.bpmResolution / 16;

  function modify(arg) {
    if(typeof(arg) === 'number') {
      return arg * resolutionModifier;
    } else if(typeof(arg) === 'function') {
      // wrap the callback in our own that multiplies it by the res modifier
      return function() {
        return arg() * resolutionModifier;
      };
    }
  }

  if(self._editingSample) {
    if(arguments.length) {
      // self._editingSample.stretchToFit = arguments[0] * (clock.bpmResolution / 16);
      var arguments = _parseArguments(arguments);
      for(var i = 0; i < arguments.length; i++) {
        arguments[i] = modify(arguments[i]);
      }
      self._editingSample.stretchSequencer.set(arguments);
    } else {
      self._editingSample.speed = 1;
      self._editingSample.stretchToFit = null;
      self._editingSample.stretchSequencer.set([]);
    }
  }
  return self;
};

track.prototype.speed = function() {
  var self = this;
  if(self._editingSample) {
    if(arguments.length) {
      self._editingSample.speedSequencer.set(arguments);
      // self._editingSample.speed = arguments[0];
      self._editingSample.stretchToFit = null;
    } else {
      self._editingSample.speedSequencer.set([]);
      self._editingSample.speed = 1;
      self._editingSample.stretchToFit = null;
    }
  }
  return self;
};

track.prototype.reverse = function() {
  var self = this;
  if(self._editingSample) {
    // need to make a new buffer to perform this operation on so we don't scuff the original.
    var oldBuffer = self._editingSample.buffer;
    var newBuffer = context.createBuffer(oldBuffer.numberOfChannels, oldBuffer.length, oldBuffer.sampleRate);
    for(var i = 0; i < oldBuffer.numberOfChannels; i++) {
      newBuffer.getChannelData(i).set(Array.prototype.reverse.call( new Float32Array(oldBuffer.getChannelData(i)) ));
    }
    self._editingSample.buffer = newBuffer;
  }
  return self;
};

track.prototype.root = function(note) {
  var self = this;
  if(self._editingSample) {
    self._editingSample.rootNote = note;
  }
  return self;
};


track.prototype.render = function(length) {
  var self = this;
  self._render(length, 16);
  return self;
};

track.prototype.render32 = function(length) {
  var self = this;
  self._render(length, 32);
  return self;
};

// reset event, which should be used by effects to quickly turn everything off
track.prototype.reset = function() {
  var self = this;
  self._emit('reset');
  return self;
};

track.prototype.eval = function() {
  var self = this;
  arguments = _parseArguments(arguments);
  self._evalSequencer.set(arguments);
  self._setState('eval', arguments);
  return self;
};

// ------------------------------------------------------------------ WEIRD

track.prototype.in = function(count) {
  var self = this;
  // return an instance of the _in queue,
  // which allows us to stage changes
  // for later.
  return new self._in(count);
};

track.prototype.log = function() {
  console.log(arguments);
  return this;
};

// merge another track's properties into this track
track.prototype.merge = function() {
  var self = this;
  arguments = _parseArguments(arguments);
  arguments.forEach( function(item) {
    self._applyState(item._state, item._stateProps);
  });
  return self;
};

track.prototype.sync = function() {
  var self = this;
  arguments = _parseArguments(arguments);

  arguments.forEach( function(item) {
    item._beatPattern.zero();
  });
  self._beatPattern.zero();

  return self;
};