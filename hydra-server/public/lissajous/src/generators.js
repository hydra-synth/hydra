// ============================================================
// RANDOM NUMBERS
// ============================================================

function rf(min, max) {
  if(!max && !min) {
    min = 0;
    max = 1;
  } else if(!max) {
    max = min;
    min = 0;
  }
  return function() {
    return Math.random() * (max - min) + min;
  };
}

function ri(min, max) {
  if(!max) {
    max = min;
    min = 0;
  }
  return function() {
    return Math.floor( Math.random() * ((max+1) - min) + min );
  };
}

// interpolate between two numbers over several steps.
// hang out at the `end` value once it is reached unless it repeats.

function step(start, end, iterations, repeat) {
  // safeguard against bad usage by returning zero
  if(start === undefined || end === undefined || !iterations) {
    return function() { return 0; };
  }

  iterations--;
  var current = -1;
  return function() {
    if(current === iterations && !repeat) {
      return start + (current * ( (end - start) / iterations ));
    } else if(current === iterations && repeat) {
      current = -1;
    }
    current++;
    return start + (current * ( (end - start) / iterations ));
  };
}

// interpolate between two numbers, ping ponging back and forth.

function bounce(start, end, iterations) {
  if(start === undefined || end === undefined || !iterations) {
    return function() { return 0; };
  }

  iterations--;
  var current = 0;
  var direction = -1;
  return function() {
    var result = start + (current * ( (end - start) / iterations ));
    if(current === 0 || current === iterations ) {
      direction *= -1;
    }
    current += direction;
    return result;
  };
}

// choose an array item randomly
function choice() {
  if(!arguments.length) return function() { return 0; };

  var items = _parseArguments(arguments);

  return function() {
    return items[ Math.floor( Math.random() * items.length ) ];
  };
}

function _e() {
  if(!arguments.length) return function() { return 0; };
  var items = _parseArguments(arguments[0]);
  var expandBy = arguments[1];
  var targetArray = [];
  for(var i = 0; i < items.length; i++) {
    for(var j = 0; j < expandBy; j++) {
      targetArray.push(items[i]);
    }
  }
  return targetArray;
}

// ============================================================
// WALK
// ============================================================

var _scales = {
 'naturalmajor': [0,2,4,5,7,9,11,12],
 'ionian': [0,2,4,5,7,9,11,12],
 'major': [0,2,4,5,7,9,11,12],
 'chromatic': [0,1,2,3,4,5,6,7,8,9,10,11,12],
 'spanish8tone': [0,1,3,4,5,6,8,10,12],
 'flamenco': [0,1,3,4,5,7,8,10,12],
 'symmetrical': [0,1,3,4,6,7,9,10,12],
 'inverteddiminished': [0,1,3,4,6,7,9,10,12],
 'diminished': [0,2,3,5,6,8,9,11,12],
 'wholetone': [0,2,4,6,8,10,12],
 'augmented': [0,3,4,7,8,11,12],
 'semitone3': [0,3,6,9,12],
 'semitone4': [0,4,8,12],
 'locrianultra': [0,1,3,4,6,8,9,12],
 'locriansuper': [0,1,3,4,6,8,10,12],
 'indian': [0,1,3,4,7,8,10,12],
 'locrian': [0,1,3,5,6,8,10,12],
 'phrygian': [0,1,3,5,7,8,10,12],
 'neapolitanminor': [0,1,3,5,7,8,11,12],
 'javanese': [0,1,3,5,7,9,10,12],
 'neapolitanmajor': [0,1,3,5,7,9,11,12],
 'todi': [0,1,3,6,7,8,11,12],
 'persian': [0,1,4,5,6,8,11,12],
 'oriental': [0,1,4,5,6,9,10,12],
 'phrygianmajor': [0,1,4,5,7,8,10,12],
 'spanish': [0,1,4,5,7,8,10,12],
 'jewish': [0,1,4,5,7,8,10,12],
 'doubleharmonic': [0,1,4,5,7,8,11,12],
 'gypsy': [0,1,4,5,7,8,11,12],
 'byzantine': [0,1,4,5,7,8,11,12],
 'chahargah': [0,1,4,5,7,8,11,12],
 'marva': [0,1,4,6,7,9,11,12],
 'enigmatic': [0,1,4,6,8,10,11,12],
 'locriannatural': [0,2,3,5,6,8,10,12],
 'naturalminor': [0,2,3,5,7,8,10,12],
 'minor': [0,2,3,5,7,8,10,12],
 'melodicminor': [0,2,3,5,7,9,11,12],
 'aeolian': [0,2,3,5,7,8,10,12],
 'algerian2': [0,2,3,5,7,8,10,12],
 'hungarianminor': [0,2,3,6,7,8,11,12],
 'algerian': [0,2,3,6,7,8,11,12],
 'algerian1': [0,2,3,6,7,8,11,12],
 'harmonicminor': [0,2,3,5,7,8,11,12],
 'mohammedan': [0,2,3,5,7,8,11,12],
 'dorian': [0,2,3,5,7,9,10,12],
 'hungariangypsy': [0,2,3,6,7,8,11,12],
 'romanian': [0,2,3,6,7,9,10,12],
 'locrianmajor': [0,2,4,5,6,8,10,12],
 'arabian': [0,1,4,5,7,8,11,12],
 'hindu': [0,2,4,5,7,8,10,12],
 'ethiopian': [0,2,4,5,7,8,11,12],
 'mixolydian': [0,2,4,5,7,9,10,12],
 'mixolydianaugmented': [0,2,4,5,8,9,10,12],
 'harmonicmajor': [0,2,4,5,8,9,11,12],
 'lydianminor': [0,2,4,6,7,8,10,12],
 'lydiandominant': [0,2,4,6,7,9,10,12],
 'overtone': [0,2,4,6,7,9,10,12],
 'lydian': [0,2,4,6,7,9,11,12],
 'lydianaugmented': [0,2,4,6,8,9,10,12],
 'leadingwholetone': [0,2,4,6,8,10,11,12],
 'blues': [0,3,5,6,7,10,12],
 'hungarianmajor': [0,3,4,6,7,9,10,12],
 'pb': [0,1,3,6,8,12],
 'balinese': [0,1,3,7,8,12],
 'pe': [0,1,3,7,8,12],
 'pelog': [0,1,3,7,10,12],
 'iwato': [0,1,5,6,10,12],
 'japanese': [0,1,5,7,8,12],
 'kumoi': [0,1,5,7,8,12],
 'hirajoshi': [0,2,3,7,8,12],
 'pa': [0,2,3,7,8,12],
 'pd': [0,2,3,7,9,12],
 'pentatonic major': [0,2,4,7,9,12],
 'chinese': [0,2,4,7,9,12],
 'chinese1': [0,2,4,7,9,12],
 'mongolian': [0,2,4,7,9,12],
 'pfcg': [0,2,4,7,9,12],
 'egyptian': [0,2,3,6,7,8,11,12],
 'pentatonic minor': [0,3,5,7,10,12],
 'chinese2': [0,4,6,7,11,12],
 'altered': [0,1,3,4,6,8,10,12],
 'bebopdominant': [0,2,4,5,7,9,10,11,12],
 'bebopdominantflatnine': [0,1,4,5,7,9,10,11,12],
 'bebopmajor': [0,2,4,5,7,8,9,11,12],
 'bebopminor': [0,2,3,5,7,8,9,10,12],
 'beboptonicminor': [0,2,3,5,7,8,9,11,12]
};

var walk = {};

var _scale;
for(_scale in _scales) {
  walk[_scale] = _createScaleFunction( _scales[_scale].slice(0) );
}

function _createScaleFunction(intervals) {
  return function(note, octaves) {
    var notesToPlay = intervals.map( function(item) {
      return item + note;
    });
    if(octaves && octaves > 1) {
      for(var i = 2; i <= octaves; i++) {
        notesToPlay = notesToPlay.concat(
          notesToPlay.map( function(item) {
            return item + 12;
          })
        );
      }
    }

    function choose(list) {
      return list[ Math.floor( Math.random() * list.length ) ];
    }

    return function() {
      return choose(notesToPlay);
    };
  };
}
