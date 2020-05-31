track.prototype._render = function(renderLength, resolution) {
  var self = this;

  // if there's no beat, get out of here
  if(!self._beatPattern.pattern.length) return;

  var lengthOfBeat = null;
  if(renderLength) {
    lengthOfBeat = renderLength * (clock.bpmResolution / resolution) * clock.noteLength();
  } else {
    lengthOfBeat = self._beatPattern.getLength32() * clock.noteLength();
  }

  // store a record instance
  var filePath = (window._demoSite) ? '/lissajous-repo/src/vendor/recorderWorker.js' : '/src/vendor/recorderWorker.js';
  self._recordInstance = new Recorder(self._destination, {
    workerPath: filePath,
  });

  // attach a new event to the _beatPattern's onFirstNote callback,
  // wherein we start recording.
  self._beatPattern.onFirstNote( function(nextTick) {

    // we're going to have to schedule this more precisely.
    // get ready for... THE BEST HACK EVER.

    _reasonablyPreciseCallback(nextTick, function(e) {
      self._recordInstance.record();
      console.log('started.');
    });

    _reasonablyPreciseCallback(nextTick + lengthOfBeat, function(e) {
      self._recordInstance.stop();

      console.log('stopped.');

      self.notes();
      if(renderLength && resolution == 16) {
        self.beat(renderLength);
      } else if(renderLength && resolution == 32) {
        self.beat32(renderLength);
      } else {
        self.beat(self._beatPattern.getLength());
      }
      self.nl(self._beatPattern.getLength());
      self.sseq();
      self.adsr();


      // get that buffer
      self._recordInstance.getBuffer( function(buffers) {
        var bufferSource = context.createBuffer( 2, buffers[0].length, context.sampleRate );
        bufferSource.getChannelData(0).set(buffers[0]);
        bufferSource.getChannelData(1).set(buffers[1]);

        // this is so meta i love it

        self.sample(bufferSource);

        // probably reset effects here?
        self._emit('reset');
      });

      self._recordInstance = null;
    });
  });
}

function _reasonablyPreciseCallback(nextTick, callback) {
  var callbackEvent = context.createOscillator();
  callbackEvent.connect(master.destination);
  callbackEvent.onended = callback;
  callbackEvent.start(nextTick);
  callbackEvent.stop(nextTick);
}

/**

what's going on here:

call track.record()
get length of beat from start to finish
need a callback for the beginning of the sequence


**/