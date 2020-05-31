// Envelope is a generic envelope that wraps an AudioParameter.
// It takes care of scheduling the parameter's attack, decay, sustain and release events.
// the setAdsr function takes clock units (32nd notes or whatever clock.bpmResolution is set to)

function Envelope() {
  var self = this;
  self.attack = null;
  self.decay = null;
  self.sustain = null;
  self.release = null;
  self.parameter = null;
  self.value = null;
}

Envelope.prototype.setAdsr = function(a,d,s,r) {
  var self = this;
  var nl = clock.noteLength();
  self.attack = nl * a;
  self.decay = nl * d;
  self.sustain = (s === null) ? 1 : s;
  self.release = nl * r;
}

Envelope.prototype.setValue = function(value) {
  var self = this;
  self.value = value;
}

Envelope.prototype.setParameter = function(param) {
  var self = this;
  self.parameter = param;
}

Envelope.prototype.schedule = function(noteStart, noteEnd) {
  var self = this;
  // self.parameter.value = self.value;
  // start at 0 if there is attack
  // self.parameter.value = (self.attack ? 0 : self.value);
  self.parameter.linearRampToValueAtTime(self.parameter.value, noteStart);
  // attack ramp
  self.parameter.linearRampToValueAtTime(self.value, noteStart + self.attack);
  // decay ramp, ends at sustain value
  self.parameter.linearRampToValueAtTime(self.value * self.sustain, noteStart + self.attack + self.decay);
  // sustain end, which is the same value as the last event.
  // if the attack and decay are longer than the note length, we need to make an event at
  // noteEnd in case there is a release event.
  if(noteStart + self.attack + self.decay < noteEnd) {
    self.parameter.linearRampToValueAtTime(self.value * self.sustain, noteEnd);
  } else {
    // either the attack will be ramping at note end...
    if(noteStart + self.attack > noteEnd) {
      // ramp to the percentage of the full value that attack reached at note end
      var percentage = (noteEnd - noteStart) / self.attack;
      self.parameter.linearRampToValueAtTime(self.value * percentage, noteEnd);
    }
    // ...or the decay
    else {
      // ramp to the percentage of the value*sustain that decay reached at note end
      var percentage = ( noteEnd - (noteStart + self.attack) ) / self.decay;
      var diff = self.value - (self.value * self.sustain);
      self.parameter.linearRampToValueAtTime(self.value - diff, noteEnd);
    }
  }
  // release
  if(self.release) {

    self.parameter.linearRampToValueAtTime(0, noteEnd + self.release);
  }

}