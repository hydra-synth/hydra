function Sequencer(callback) {
  var self = this;
  self.pattern = [];
  self.currentStep = 0;
  self.callback = callback;
}

Sequencer.prototype.set = function(arguments) {
  var self = this;
  self.pattern = Array.prototype.slice.call(arguments);
  // this could change but for now let's reset the step when the pattern changes
  self.currentStep = 0;
};

Sequencer.prototype.next = function(nextTick) {
  var self = this;
  if(self.pattern.length) {
    if(typeof self.pattern[self.currentStep] === 'function') {
      self.callback(self.pattern[self.currentStep](), nextTick);
    } else {
      self.callback(self.pattern[self.currentStep], nextTick);
    }
    self.currentStep = ++self.currentStep % self.pattern.length;
  }
};