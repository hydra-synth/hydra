track.prototype.chorus = function(rate, fb, delay) {
  var self = this;

  if(arguments.length == 0) {
    if(self._chorusEffectIndex !== null) {
      // remove the `reset` handler
      self._off('reset', self._chorusEffectIndex);
      self._chorusEffectIndex = self._removeFromChain(self._chorusEffectIndex);
      self._setState('chorus', []);
    }
  } else {
    if(self._chorusEffectIndex == null) {

      self._chorus = new tuna.Chorus({
        // rate is a 16th note interval
        rate: clock.noteLengthToHz(rate, 16) || 1,
        feedback: fb || 0.2,
        delay: (delay * clock.noteLength() * (clock.bpmResolution / 16)) || 0.0,
        bypass: 0
      });

      self._chorusEffectIndex = self._addToChain(self._chorus.input, self._chorus);

      // attach a `reset` handler that turns off the effect
      self._once('reset', self._chorusEffectIndex, function() {
        self.chorus();
      });
    } else {
      self._chorus.rate = clock.noteLengthToHz(rate, 16);
      self._chorus.feedback = fb || 0.2;
      self._chorus.delay = delay * clock.noteLength() * (clock.bpmResolution / 16) || 0.0;
    }
    self._setState('chorus', [self._chorus.rate, self._chorus.feedback, self._chorus.delay]);
  }

  return self;
}