track.prototype._createFilter = function() {
  var self = this;
  var filter = context.createBiquadFilter();
  filter.type = self._filterType || "lowpass";
  filter.frequency.value = _convertToFreq(self._filterFrequency);
  filter.Q.value = self._filterRes;
  return filter;
}

track.prototype._scheduleFilterEnvelope = function(filter, noteStart, noteEnd) {
  var self = this;
  var envelope = new Envelope();
  envelope.setParameter(filter.frequency);
  envelope.setAdsr(self._filterEnvAttack, self._filterEnvDecay, self._filterEnvSustain, self._filterEnvRelease);
  envelope.setValue( _convertToFreq(self._filterFrequency) + _convertToFreq(self._filterEnvAmt) );
  envelope.schedule(noteStart, noteEnd);
}