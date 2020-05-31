track.prototype._makeOscillator = function(noteStart, noteEnd) {
  var self = this;
  var sound = context.createOscillator();
  sound.type = self._oscType;
  sound.frequency.value = _convertToFreq(self._currentNote);

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

  if(self._filterIsActive) {
    var filter = self._createFilter();
    self._scheduleFilterEnvelope(filter, noteStart, noteEnd);
    gain.connect(filter);
    self._connectToChain(filter);
    // console.log(filter);
  } else {
    self._connectToChain(gain);
  }


  sound.start(noteStart);
  sound.stop(newNoteEnd);
}

function _convertToFreq(note) {
  return ( Math.pow(2, (note-69)/12) ) * 440.0;
}

function _convertToNote(freq) {
  return 69 + 12 * Math.log(freq / 440) / Math.log(2);
}