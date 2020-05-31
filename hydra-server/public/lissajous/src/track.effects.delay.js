track.prototype.delay = function(dtime, fb, level) {
  var self = this;
  if(arguments.length == 0) {
    if(self._delayEffectIndex !== null) {
      // remove any events associated with this instance of the effect
      self._off('reset', self._delayEffectIndex);
      // remove the effect from the chain
      self._delayEffectIndex = self._removeFromChain(self._delayEffectIndex);
      // detach all sequencers
      self._detachSequencers( self._delayDtimeSequencer, self._delayFbSequencer, self._delayLevelSequencer );
      self._setState('delay', []);
    }
  } else {
    if(self._delayEffectIndex == null) {
      self._delay = new DelayEffect(dtime, fb, level);

      // make a sequencer for changing the delay time
      self._delayDtimeSequencer = new Sequencer( function(value) {
        self._delay.delay.delayTime.value = value * (clock.bpmResolution / 16) * clock.noteLength();
      });

      // make a sequencer for changing the feedback time
      self._delayFbSequencer = new Sequencer( function(value) {
        self._delay.feedback.gain.value = value;
      });

      // make a sequencer for changing the wet level
      self._delayLevelSequencer = new Sequencer( function(value) {
        self._delay.wetLevel.gain.value = value;
      });

      self._attachSequencers( self._delayDtimeSequencer, self._delayFbSequencer, self._delayLevelSequencer );

      self._delayEffectIndex = self._addToChain(self._delay.input, self._delay.output);

      // attach a `reset` handler that turns off the effect
      self._once('reset', self._delayEffectIndex, function() {
        self.delay();
      });
    }

    self._delayDtimeSequencer.set([dtime]);
    self._delayFbSequencer.set([fb || 0.25]);
    self._delayLevelSequencer.set([level || 0.5]);
    self._setDelayState();
  }
  return self;
}

track.prototype._setDelayState = function() {
  var self = this;
  self._setState('delay', [
    self._delayDtimeSequencer.pattern,
    self._delayFbSequencer.pattern,
    self._delayLevelSequencer.pattern
  ]);
  self._removeState('dtime');
  self._removeState('dfb');
  self._removeState('dlevel');
}

track.prototype.dtime = function() {
  var self = this;
  arguments = _parseArguments(arguments);
  if(self._delay) {
    if(arguments.length == 0) {
      self._delayDtimeSequencer.set(clock.noteLength() * (clock.bpmResolution / 16));
    } else {
      self._delayDtimeSequencer.set(arguments);
    }
  }

  if(self._delayEffectIndex) {
    self._setDelayState();
  } else {
    self._setState('dtime', arguments);
  }
  return self;
}

track.prototype.dfb = function() {
  var self = this;
  arguments = _parseArguments(arguments);
  if(self._delay) {
    if(arguments.length == 0) {
      self._delayFbSequencer.set(0);
    } else {
      self._delayFbSequencer.set(arguments);
    }
  }

  if(self._delayEffectIndex) {
    self._setDelayState();
  } else {
    self._setState('dfb', arguments);
  }
  return self;
}

track.prototype.dlevel = function(level) {
  var self = this;
  arguments = _parseArguments(arguments);
  if(self._delay) {
    if(arguments.length == 0) {
      self._delayLevelSequencer.set(0);
    } else {
      self._delayLevelSequencer.set(arguments);
    }
  }

  if(self._delayEffectIndex) {
    self._setDelayState();
  } else {
    self._setState('dlevel', arguments);
  }
  return self;
}

function DelayEffect(dtime, fb, level) {
  // taken from http://www.html5rocks.com/en/tutorials/casestudies/jamwithchrome-audio/ ... thanks!
  this.input = context.createGain();
  this.output = context.createGain();
  this.delay = context.createDelay();

  this.feedback = context.createGain();
  this.wetLevel = context.createGain();

  //set some decent values
  this.delay.delayTime.value = ((dtime || 0) * clock.noteLength()) || clock.noteLength();
  this.feedback.gain.value = fb || 0.25;
  this.wetLevel.gain.value = level || 0.5;

  //set up the routing
  this.input.connect(this.delay);
  this.input.connect(this.output);
  this.delay.connect(this.feedback);
  this.delay.connect(this.wetLevel);
  this.feedback.connect(this.delay);
  this.wetLevel.connect(this.output);

  this.connect = function(target){
     this.output.connect(target);
  };
}