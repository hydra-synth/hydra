const {getFileHandle, getNewFileHandle, readFile, verifyPermission, writeFile} = require("./fs-helpers.js")
const repl = require('../src/repl.js')

// Thanks to: https://odino.org/emit-a-beeping-sound-with-javascript/
let ac;
let beepsEnabled = true

function beeper(vol, freq, duration){
	if (ac === undefined)
	{
		ac = new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em
	}
  v=ac.createOscillator()
  u=ac.createGain()
  v.connect(u)
  v.frequency.value=freq
  v.type="sawtooth"
  u.connect(ac.destination)
  u.gain.value=vol*0.01
  v.start(ac.currentTime)
  v.stop(ac.currentTime+duration)
}

function beep()
{
	if (beepsEnabled) {
		beeper(0.5, 220, 0.1)
	}
}


class PlayRec {
  constructor (callback) {
    this.playA = []
    this.recordA = []
    this.playerIndex = -1
    this.evaluator = callback
    this.defaultDuration = 2.0
    this.realTimePlayback = false
    this.bindUI()
  }



bindUI()
{
			this.clearRecordingButton = document.getElementById("clear")
			this.clearRecordingButton.onclick = this.doClear.bind(this)

	    this.fileImportButton = document.getElementById("file-import")
	    this.fileImportButton.onclick = this.doFileImport.bind(this);

	    this.fileExportButton = document.getElementById("file-export")
	    this.fileExportButton.onclick = this.doFileExport.bind(this);

			this.loadRecordButton = document.getElementById("load")
	    this.loadRecordButton.onclick = this.doLoad.bind(this);
	
			this.deckDiv = document.getElementById("deck")
			this.counterSpan = document.getElementById("counter")

	    this.fastBackwardButton = document.getElementById("fast-backward")
	    this.fastBackwardButton.onclick = this.doFastBackward.bind(this);

	    this.stepBackwardButton = document.getElementById("step-backward")
	    this.stepBackwardButton.onclick = this.doStepBackward.bind(this)

	    this.playButton = document.getElementById("play")
	    this.playButton.onclick = this.doPlay.bind(this)

	    this.stepForwardButton = document.getElementById("step-forward")
    	this.stepForwardButton.onclick = this.doStepForward.bind(this)

	    this.fastForwardButton = document.getElementById("fast-forward")
    	this.fastForwardButton.onclick = this.doFastForward.bind(this)

	    this.markButton = document.getElementById("thumbs-up")
    	this.markButton.onclick = this.doMark.bind(this)

//	    this.settingsButton = document.getElementById("cog")
//    	this.settingsButton.onclick = this.doSettings.bind(this)
    	
    	this.boundTimerHandler = this.timerHandler.bind(this)
}




pushSketch(code)
{
  	let snapshot = {
  		timeStamp: Date.now(),
  		sketch:    code
  	}
  	this.recordA.push(snapshot)
  	beep()
}

doClear(e)
{
	this.recordA = []
}

doFileImport()
{
	this.openFile();
}

doFileExport(e)
{
	this.saveFile(e)
}


doLoad(e)
{
	let asText = this.recordingToText();
	this.loadPlayer(asText)
	this.deckDiv.style.opacity = 1;
}
	    
doFastBackward(e)
{
	this.moveFast(e, -1)
}

doStepBackward(e)
{
	this.moveUp(e)
}

clearTimer()
{
	if (this.activeTimer)
	{
		clearTimeout(this.activeTimer)
		this.activeTimer = null
	}
}

startTimer(dur)
{
	this.clearTimer()
	let durMS = dur * 1000
	this.activeTimer = setTimeout(this.boundTimerHandler, durMS)
}

timerHandler()
{
	this.activeTimer = null
	if(this.realTimePlayback)
	{
		this.moveDown()
	}
}


doPlay(e)
{
	this.realTimePlayback = !this.realTimePlayback
	if (this.realTimePlayback)
	{
		this.playButton.className = "fas fa-pause-circle pricon"
		this.moveDown()
	} else {
		this.clearTimer()
		this.playButton.className = "fas fa-play pricon"
	}

}

doStepForward(e)
{
	this.moveDown(e)
}


doFastForward(e)
{
		this.moveFast(e, 1)
}


doMark(e)
{
	this.mark()
}


doSettings(e)
{
	
}



/**
 * Saves a recording to disk.
 */
async saveFile(e)
{
  let fileHandle;
  try {
    fileHandle = await getNewFileHandle();
  } catch (ex) {
    if (ex.name === 'AbortError') {
      return;
    }
    const msg = 'An error occured trying to open the file.';
    console.error(msg, ex);
    alert(msg);
    return;
  }
    try {
    	let text = this.recordingToText()
    	await writeFile(fileHandle, text);
    	// recordingA = [];

  } catch (ex) {
    const msg = 'Unable to save file.';
    console.error(msg, ex);
    alert(msg);
    return;
  }
}

  async openFile(e)
  {
  	let fhand = await getFileHandle();
		const file = await fhand.getFile();
		let text = await readFile(file);
	
		this.loadPlayer(text);
 
  }

	recordingToText()
	{
		let stringBuff = [];
	
		let rSize = this.recordA.length
		for (let i = 0; i < rSize; ++i)
		{
			let ent = this.recordA[i];
			let dT = 0
			if (ent.timeStamp) {
				if (i < rSize - 1)
				{
					dT = this.recordA[i + 1].timeStamp - ent.timeStamp;
					if (dT < 0)
					{
						dT = 0
					}
				}
				dT = dT / 1000
			} else {
				if (ent.dur)
				{
					dT = dur;
				} else {
					dT = 1.0
				}
			}

   		stringBuff.push("//+ dur=" + dT);

 			let labelString = "";
 			if (ent.mark)
 			{
				labelString += "mark"
 			}
 			if (labelString !== "")
  		{
  			stringBuff.push("; label='" + labelString + "'")
  		}
			stringBuff.push( " // " + i + " " + new Date(ent.timeStamp).toLocaleString() + "\n");
			stringBuff.push(ent.sketch)
			stringBuff.push("\n\n\n\n")
		}
		return stringBuff.join("")
	}

	 loadPlayer(text) {
		this.deckDiv.style.opacity = 1;
		this.playA = [];
		let textA = text.split(/\r\n|\n/)
		let aSize = textA.length
		let ix = 0
		let working = []
		let runL = 0;
		let lastDur = 0; let marked = false;
		for (ix = 0; ix < aSize; ++ix) {
			let ln = textA[ix]
			if (ln.trim() === '' || ln.startsWith ("----")) {
				runL++
			} else
			if (ln.startsWith("//+"))
			{
				// We have a frame boundary indicator, strip out the comment prefix and evaluate
				// to pickup mark & duration.
				let restOfLine = ln.substring(3)
				// ** JFF Hack Alert!

				// Note that this is a dangerous opprotunity for evil code injection.
				// But since Hydra uses eval() all over the place, we are not the only sinners in this congregation.

				// fake global variables and return results
				let hackLine = "let label;let dur; " + restOfLine + "\n let cat = {}; cat.label = label; cat.dur = dur; cat";

				let result = {}
				try {
					result = eval(hackLine)
   		 	} catch (e) {
					console.log("//+ error: " + e)
  		 	}
				if (result.label !== undefined && result.label.toLowerCase().includes("mark"))
				{
					marked = true;
				}
				if (result.dur !== undefined && result.dur >= 0)
				{
					lastDur = result.dur;
			}
			} else
			{
				if (runL >= 3) {
					// we have a split
					if (working.length > 0) {
						let sketch = working.join("\n")
						this.playA.push({dur: lastDur, mark: marked, sketch: sketch})
						working = []
						}
				}
				// no split yet, reset count.
				runL = 0;
				working.push(ln)
				lastDur = 0
				marked = false
			}
		}
		// Deal with last entry if we must.
		if (working.length > 0) {
			let lastSketch = working.join("\n")
			this.playA.push({dur: lastDur, mark: marked, sketch: lastSketch})
		}
		// console.log(this.playA)
	}

	loadAtIndex()
	{
		if (this.playA.length === 0) return;
		hush()
		this.evaluator(this.playA[this.playerIndex].sketch)
		this.counterSpan.innerHTML = this.playerIndex;
		if (this.realTimePlayback)
		{
			this.clearTimer()
			let dur = this.playA[this.playerIndex].dur
			if (dur <= 0){dur = this.defaultDuration}
			this.startTimer(dur)
		}
	}

  moveUp(e)
  {
		if (this.playA.length === 0) return;
  	this.playerIndex--;
  	if (this.playerIndex < 0) {	
			this.playerIndex = this.playA.length - 1
		}
  	this.loadAtIndex();
  }

  moveDown(e)
  {
		if (this.playA.length === 0) return;
		this.playerIndex++;
		if (this.playerIndex >= this.playA.length) this.playerIndex = 0
		this.loadAtIndex();
  }

	moveFast(e, dir)
	{
		let loopMax = this.playA.length;
		while (loopMax > 0) {
			this.playerIndex += dir
			if (this.playerIndex < 0)
			{
				this.playerIndex = this.playA.length - 1
			}
			if (this.playerIndex >= this.playA.length)
			{
				this.playerIndex = 0
			}
			let ent = this.playA[this.playerIndex]
			if ((ent.mark !== undefined && ent.mark )
					|| (ent.dur !== undefined && ent.dur > this.defaultDuration))
			{
				this.loadAtIndex();
				return
			}
			loopMax--;
		}
	}

	mark(e) {
		if (this.recordA.length === 0) return;
		this.recordA[this.recordA.length - 1].mark = true;
		// Hack until a better UI gets made:
	}

}
module.exports = PlayRec