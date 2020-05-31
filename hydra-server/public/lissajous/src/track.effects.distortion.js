track.prototype.dist = function(gain, drive, curve, type) {
  var self = this;

  if(arguments.length == 0) {
    if(self._distEffectIndex !== null) {
      // remove the `reset` handler
      self._off('reset', self._distEffectIndex);
      self._distEffectIndex = self._removeFromChain(self._distEffectIndex);
      self._setState('dist', []);
    }
  } else {
    if(self._distEffectIndex == null) {

      self._dist = new tuna.Overdrive({
        outputGain: gain,
        drive: drive || 0.7,
        curveAmount: curve || 1,
        algorithmIndex: type || 0,
        bypass: 0
      });

      self._distEffectIndex = self._addToChain(self._dist.input, self._dist);

      // attach a `reset` handler that turns off the effect
      self._once('reset', self._distEffectIndex, function() {
        self.dist();
      });
    } else {
      self._dist.outputGain.value = gain;
      self._dist.drive.value = drive || 0.7;
      self._dist.curveAmount = curve || 1;
      self._dist.algorithmIndex = type || 0;
    }
    self._setState('dist', [
      self._dist.outputGain.value,
      self._dist.drive.value,
      self._dist.curveAmount,
      self._dist.algorithmIndex
    ]);
  }

  return self;
}