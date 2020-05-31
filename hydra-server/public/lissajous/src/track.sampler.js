track.prototype._makeSampler = function(noteStart, noteEnd) {
  var self = this;

  // the sample is the object holding the sample's state...
  var sample = self._currentSample;
  // ...whereas the sound is the buffer we're going to schedule & play
  var sound = context.createBufferSource();

  // update makes sure the loop points are recalculated (if there is a clampshift)
  // and the notes (or stretch) are correctly applied. and whatever else needs to happen every beat.
  sample.hasNoteSequence = (self._notesSequencer.pattern.length > 0);
  sample.setNote(self._currentNote);
  sample.update();

  // now we take the sample's properties and apply it to the sound.
  sound.buffer = sample.buffer;
  sound.playbackRate.value = sample.speed;
  sound.loop = sample.looping;
  var sampleClampStart = sample.loopStart * sound.buffer.duration;
  // end is specified as a duration, so we have to subtract the endpoint from the startpoint
  var sampleClampEnd = (sound.buffer.duration * sample.loopEnd) - sampleClampStart;
  sound.loopStart = sample.loopStart * sound.buffer.duration;
  sound.loopEnd = sample.loopEnd * sound.buffer.duration;

  // make the envelope
  var envelope = new Envelope();
  var gain = context.createGain();
  gain.gain.value = (self._attack ? 0 : self._volume);

  envelope.setParameter(gain.gain);
  envelope.setAdsr(self._attack, self._decay, self._sustain, self._release);
  envelope.setValue(self._volume);

  envelope.schedule(noteStart, noteEnd);
  // can't find a more elegant way to do this at the moment.
  var newNoteEnd = noteEnd + envelope.release;

  sound.connect(gain);

  // if we have an active filter we want to make and connect it here,
  // since the filter and its envelope is tied to the individual note
  // & not the track as a whole.
  if(self._filterIsActive) {
    // note that we're not using newNoteEnd here, since this envelope might
    // also have a release value beyond the note end itself.
    var filter = self._createFilter();
    self._scheduleFilterEnvelope(filter, noteStart, noteEnd);
    // we've got the filter back... hook it all up and we're good to go.
    gain.connect(filter);
    self._connectToChain(filter);
  } else {
    self._connectToChain(gain);
  }

  if(sampleClampStart !== null || sample.looping) {
    sound.start(noteStart, sampleClampStart, sampleClampEnd);
    sound.stop(newNoteEnd);
  } else {
    sound.start(noteStart);
    sound.stop(newNoteEnd);
  }
};


// We want to support multiple samples per track,
// so we wrap all of a sample's functionality into
// a nice package called Sample. check out
// track.select() in track.api.js, where we keep
// a reference to one sample at a time so we know
// which one to apply the edits to.

function Sample(buffer) {
  var self = this;
  self.buffer = buffer;
  // give the sample some parameters
  self.defaultParams();
  // sample sequencers are triggered automatically by the beatPattern scheduler.
  self.sequencers = [];
  self.clampShiftSequencer = new Sequencer( function(value) {
    self.clampShift = value;
  });
  self.sequencers.push(self.clampShiftSequencer);
  self.stretchSequencer = new Sequencer( function(value) {
    self.stretchToFit = value;
  });
  self.sequencers.push(self.stretchSequencer);
  self.speedSequencer = new Sequencer( function(value) {
    self.speed = value;
  });
  self.sequencers.push(self.speedSequencer);
}

Sample.prototype.update = function() {
  var self = this;

  if(self.clampShift) {
    var looplength = self.loopEnd - self.loopStart;
    self.loopEnd += self.clampShift;
    self.loopStart += self.clampShift;
    if(self.loopEnd > 1) {
      self.loopStart = 0;
      self.loopEnd = looplength;
    } else if(self.loopStart < 0) {
      self.loopEnd = 1;
      self.loopStart = 1 - looplength;
    }
  }

  // for now note sequencing will override stretching
  if(self.hasNoteSequence) {
    self.speed = _convertToFreq(self.currentNote) / _convertToFreq(self.rootNote);
  } else if(self.stretchToFit) {
    self.speed = self.buffer.duration / ( clock.noteLength() * self.stretchToFit );
  }
};

Sample.prototype.getBeatLength = function(overflow) {
  var self = this;
  if(overflow !== false && overflow !== 0) {
    overflow = true;
  }
  var notes = self.buffer.duration / clock.noteLength();
  return overflow ? Math.ceil(notes) : Math.floor(notes);
};

Sample.prototype.setNote = function(note) {
  var self = this;
  self.currentNote = note;
};

Sample.prototype.defaultParams = function() {
  var self = this;
  self.speed = 1;
  self.stretchToFit = null;
  self.looping = false;
  self.loopStart = 0;
  self.loopEnd = 1;
  self.clampShift = 0;
  self.rootNote = 69;
  self.currentNote = 69;
  self.hasNoteSequence = false;
};