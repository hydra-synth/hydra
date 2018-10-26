### Web MIDI

#### Experimental! 

Hydra can be used with [Web MIDI](https://webaudio.github.io/web-midi-api/) for an extra layer of control to your visuals.  At this time this requires some running of code on the
browser console (Press F12 in Chrome to access).  This page only considers MIDI Continuous Controllers (CC) but other types of data may be accessible.

This is a generic script that doesn't care what Midi Channel you're broadcasting on and maps a normalized value 0.0-1.0 into an array named cc. 

### Console Script
This portion should be ran in the console & will register Web MIDI & map the incoming CC data to a set of parameters.  For simplicity, these
parameters are named to match the CC number.  The CC values are normally in a range from 0-127, but we've also normalized them to be in a range of 0.0-1.0.

```
// register WebMIDI
navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
    console.log(midiAccess);
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;
    for (var input of midiAccess.inputs.values()){
        input.onmidimessage = getMIDIMessage;
    }
}

function onMIDIFailure() {
    console.log('Could not access your MIDI devices.');
}

//create an array to hold our cc values and init to a normalized value
var cc=Array(128).fill(0.5)

getMIDIMessage = function(midiMessage) {
    var arr = midiMessage.data    
    var index = arr[1]
    //console.log('Midi received on cc#' + index + ' value:' + arr[2])    // uncomment to monitor incoming Midi
    var val = (arr[2]+1)/128.0  // normalize CC values to 0.0 - 1.0
    cc[index]=val
}
```

### Hydra script
Now that these controls have been assigned to the cc[] array, we can start using them in Hydra.  As we've normalized the values 0-1 we can use
as-is with most functions or quickly remap them with various math.  
```
// example midi mappings - Korg NanoKontrol2 CCs

// color controls with first three knobs
noise(4).color( ()=>cc[16], ()=>cc[17], ()=>cc[18] ).out()

// rotate & scale with first two faders
osc(10,0.2,0.5).rotate( ()=>(cc[0]*6.28)-3.14 ).scale( ()=>(cc[1]) ).out()

```
