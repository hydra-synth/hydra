function Note(length) {
  var self = this;
  self.length = length;
}

function Rest(length) {
  var self = this;
  self.length = length;
}

function Scheduler(callback) {
  var self = this;
  self.pattern = [];
  self.currentStep = 0;
  self.untilNextBeat = 0;

  self.callback = callback || function(){};
  self.firstNoteCallbacks = [];
}

Scheduler.prototype.set = function(arguments, resolution) {
  var self = this;
  var args = Array.prototype.slice.call(arguments);

  // pattern gets reset no matter what
  self.pattern = [];

  var resolutionModifier = clock.bpmResolution / (resolution || 16);

  // for step sequencer syntax: ([1, 0, 0, 0, 1, 0, 0, 0])
  // if(args.length == 1 && Array.isArray(args[0])) {
    // this is one of those step sequencer jams
    args.forEach( function(step) {
      if(typeof step === 'function') {
        self.pattern.push({ fn: step, resolutionModifier: resolutionModifier });
      } else {
        if(step > 0) {
          self.pattern.push( new Note(step * resolutionModifier) );
        } else {
          self.pattern.push( new Rest(1 * resolutionModifier) );
        }
      }
    });
  // }

  // // for beat length syntax: (4, 3, [2], 1)
  // else {
  //   args.forEach( function(beat) {
  //     // if it's just an integer, add a Note(int)
  //     // or, if it's an int in an array, add a Rest(int)
  //     if(Array.isArray(beat)) {
  //       self.pattern.push( new Rest(beat[0] * resolutionModifier ) );
  //     } else {
  //       self.pattern.push( new Note(beat * resolutionModifier ) );
  //     }
  //   });
  // }
  self.currentStep = 0;
}

Scheduler.prototype.zero = function() {
  var self = this;
  self.currentStep = 0;
  self.untilNextBeat = 0;
}

Scheduler.prototype.tick = function(nextTick) {
  var self = this;
  // the clock is telling us when the next note is. check if we have something to play:
  if(self.pattern.length) {
    if(self.untilNextBeat == 0) {
      // do the work, but only if it's a note or a callback (not a rest)
      if( !(self.pattern[self.currentStep] instanceof Rest) ) {
        self.callback(nextTick);
        if(self.currentStep === 0) {
          self.doFirstNoteCallbacks(nextTick);
        }
      }
      // set untilNextBeat based on the next value in the sequencer array.
      if(self.pattern[self.currentStep].fn) {
        self.untilNextBeat = self.pattern[self.currentStep].fn() * self.pattern[self.currentStep].resolutionModifier - 1;
      } else {
        self.untilNextBeat = self.pattern[self.currentStep].length - 1;
      }

      self.currentStep = ++self.currentStep % self.pattern.length;
    } else {
      self.untilNextBeat--;
      return;
    }
  }
}

Scheduler.prototype.getLength = function() {
  var self = this;

  var sum = 0;
  for(var i = 0; i < self.pattern.length; i++) {
    sum += self.pattern[i].length / (clock.bpmResolution / 16);
  }

  return sum;
}

Scheduler.prototype.getLength32 = function() {
  var self = this;

  var sum = 0;
  for(var i = 0; i < self.pattern.length; i++) {
    var l;
    if(typeof self.pattern[i] === 'function') {
      l = self.pattern[i]();
    } else {
      l = self.pattern[i];
    }
    sum += l / (clock.bpmResolution / 32);
  }

  return sum;
}

Scheduler.prototype.doFirstNoteCallbacks = function(nextTick) {
  var self = this;
  if(self.firstNoteCallbacks.length) {
    for(var i = 0; i < self.firstNoteCallbacks.length; i++) {
      self.firstNoteCallbacks[i](nextTick);
    }
  }
  self.firstNoteCallbacks = [];
}

Scheduler.prototype.onFirstNote = function(callback) {
  var self = this;
  self.firstNoteCallbacks.push(callback);
}