const {getFileHandle, getNewFileHandle, readFile, verifyPermission, writeFile} = require("./fs-helpers.js")


class PlayRec {
  constructor (callback) {
    this.playA = []
    this.recordA = []
    this.playerIndex = -1
    this.evaluator = callback
    this.onlyMarked = false
  }



bindUI()
{
	    this.fileImportButton = document.getElementById("file-import")
	    this.fileImportButton.onclick = this.doFileImport.bind(this);

	    this.fileExportButton = document.getElementById("file-export")
	    this.fileExportButton.onclick = this.doFileExport.bind(this);
	    
	    this.fastBackwardButton = document.getElementById("fast-backward")
	    this.fastBackwardButton.onclick = this.doFastBackward.bind(this);

	    this.backwardButton = document.getElementById("backward")
	    this.backwardButton.onclick = this.doBackward.bind(this)

	    this.stepBackwardButton = document.getElementById("step-backward")
	    this.stepBackwardButton.onclick = this.doStepBackward.bind(this)

	    this.stopButton = document.getElementById("stop")
	    this.stopButton.onclick = this.doStop.bind(this)

	    this.pauseButton = document.getElementById("pause")
    	this.pauseButton.onclick = this.doPause.bind(this)

	    this.stepForwardButton = document.getElementById("step-forward")
    	this.stepForwardButton.onclick = this.doStepForward.bind(this)

	    this.forwardButton = document.getElementById("forward")
    	this.forwardButton.onclick = this.doForward.bind(this)

	    this.fastForwardButton = document.getElementById("fast-forward")
    	this.fastForwardButton.onclick = this.doFastForward.bind(this)

	    this.markButton = document.getElementById("thumbs-up")
    	this.markButton.onclick = this.doMark.bind(this)

	    this.settingsButton = document.getElementById("cog")
    	this.settingsButton.onclick = this.doSettings.bind(this)
}




pushSketch(code)
{
  	let snapshot = {
  		timeStamp: Date.now(),
  		sketch:    code
  	}
  	this.recordA.push(snapshot)
}


doFileImport()
{
	
}

doFileExport()
{
	
}

	    
doFastBackward()
{
	
}

backwardButton()
{
	    	
}
doStepBackward()
{
	
}

doStop()
{
	
}


pauseButton()
{
	
}


doStepForward()
{
	
}


doForward()
{
	
}


doFastForward()
{
	
}


doMark()
{
	
}


doSettings()
{
	
}








/**
 * Saves a new file to disk.
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
			if (ent.mark || !this.onlyMarked) {
				if (i < rSize - 1)
				{
					dT = this.recordA[i + 1].timeStamp - ent.timeStamp;
					if (dT < 0)
					{
						dT = 0
					}
				}
			}
   		stringBuff.push("//+ dur=" + (dT / 1000.0));

 			let labelString = "";
 			if (ent.mark)
 			{
				labelString += "mark"
 			}
 			if (labelString !== "")
  		{
  			stringBuff.push("; label='" + labelString + "'")
  		}
			stringBuff.push( " // " + new Date(ent.timeStamp).toLocaleString() + "\n");
			stringBuff.push(ent.sketch)
			stringBuff.push("\n\n\n\n")
		}
		return stringBuff.join("")
	}

	loadPlayer(text) {
		this.playA = [];
		let textA = text.split(/\r\n|\n/)
		let aSize = textA.length
		let ix = 0
		let working = []
		let runL = 0;
		for (ix = 0; ix < aSize; ++ix) {
			let ln = textA[ix]
			if (ln.trim() === '' || ln.startsWith ("----")) {
				runL++
			} else
			{
				if (runL >= 3) {
					// we have a split
					if (working.length > 0) {
						let sketch = working.join("\n")
						this.playA.push({timeStamp: 0, sketch: sketch})
						working = []
						}
				}
				// no split yet, reset count.
				runL = 0;
				working.push(ln)
			}
		}
		// Deal with last entry if we must.
		if (working.length > 0) {
			let lastSketch = working.join("\n")
			this.playA.push({timeStamp: 0, sketch: lastSketch})
		}
		// console.log(this.playA)
	}

	loadAtIndex()
	{
		if (this.playA.length === 0) return;
		this.evaluator(this.playA[this.playerIndex].sketch)
	}

  moveUp(e)
  {
		if (this.playA.length === 0) return;
  	this.playerIndex--;
  	if (this.playerIndex < 0) this.playerIndex = this.playA.length - 1
  	this.loadAtIndex();
  	
  }
  
  moveDown(e)
  {
		if (this.playA.length === 0) return;
		this.playerIndex++;
		if (this.playerIndex >= this.playA.length) this.playerIndex = 0
		this.loadAtIndex();
  }

	mark(e) {
		if (this.recordA.length === 0) return;
		this.recordA[this.recordA.length - 1].mark = true;
		// Hack until a better UI gets made:
		// this.onlyMarked = true
	}

}
module.exports = PlayRec