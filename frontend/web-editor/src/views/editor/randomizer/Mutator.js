const {Parser} = require("acorn");
const {generate} = require('astring');
const { defaultTraveler, attachComments, makeTraveler } = require('astravel');
const {UndoStack} = require('./UndoStack.js');
const repl = require('./../repl.js')
const glslTransforms = require('hydra-synth/src/glsl/glsl-functions.js')()

class Mutator {

  constructor(editor) {
    this.editor = editor;
    this.undoStack = new UndoStack();

    this.initialVector = [];

    this.funcTab = {};
    this.transMap = {};
		this.scanFuncs();
		this.dumpDict();
  }

  dumpList() {
  	let gslTab = glslTransforms;
  	gslTab.forEach (v => {
  		var argList = "";
  		v.inputs.forEach((a) => {
  			if (argList != "") argList += ", ";
  			let argL = a.name + ": " + a.type + " {" + a.default + "}";
  			argList = argList + argL;
  		});
  	//	console.log(v.name + " [" + v.type + "] ("+ argList + ")");
  	});
  }

  scanFuncs() {
  	let gslTab = glslTransforms;
  	gslTab.forEach (f => {
  		this.transMap[f.name] = f;
  		if (this.funcTab[f.type] === undefined) {this.funcTab[f.type] = []}
			this.funcTab[f.type].push(f);
  	});
  }

	dumpDict() {
		for(let tn in this.funcTab)
		{
			this.funcTab[tn].forEach(f => {
  		var argList = "";
  		f.inputs.forEach((a) => {
  			if (argList != "") argList += ", ";
  			let argL = a.name + ": " + a.type + " {" + a.default + "}";
  			argList = argList + argL;
  		});
  		//console.log(f.name + " [" + f.type + "] ("+ argList + ")");
			});
    }
	}

  mutate(options) {
    // Get text from CodeMirror.
    let text = this.editor.cm.getValue();
    this.undoStack.push({text, lastLitX: this.lastLitX});
    let needToRun = true;
    let tryCounter = 5;
    while (needToRun && tryCounter-- >= 0) {
        // Parse to AST
        var comments = [];
        let ast = Parser.parse(text, {
            locations: true,
            onComment: comments}
        );

        // Modify the AST.
        this.transform(ast, options);

        // Put the comments back.
        attachComments(ast, comments);

        // Generate JS from AST and set back into CodeMirror editor.
        let regen = generate(ast, {comments: true});

        this.editor.cm.setValue(regen);
				try {
        // Evaluate the updated expression.
        repl.eval(regen, (code, error) => {
            // If we got an error, keep trying something else.
            if (error) {
                console.log("Eval error: " + regen);
            }
            needToRun = error;
        });
      } catch (err) {
      	console.log("Exception caught: " + err);
      	needToRun = err;
      }
     }
  }

  doUndo() {
    // If the current text is unsaved, save it so we can redo if need be.
    if (this.undoStack.atTop()) {
        let text = this.editor.cm.getValue();
        this.undoStack.push({text, lastLitX: this.lastLitX});
    }
    // Then pop-off the info to restore.
    if (this.undoStack.canUndo()) {
        let {text, lastLitX} = this.undoStack.undo();
        this.setText(text);
        this.lastLitX = lastLitX;
    }
  }

  doRedo() {
    if(this.undoStack.canRedo()) {
        let {text, lastLitX} = this.undoStack.redo();
        this.setText(text);
        this.lastLitX = lastLitX;
    }
  }

  setText(text) {
    this.editor.cm.setValue(text);
    repl.eval(text, (code, error) => {
    });

    }

  // The options object contains a flag that controls how the
  // Literal to mutate is determined. If reroll is false, we
  // pick one at random. If reroll is true, we use the same field
  // we did last time.
  transform(ast, options) {
    // An AST traveler that accumulates a list of Literal nodes.
    let traveler = makeTraveler({
  go: function(node, state) {
        if (node.type === 'Literal') {
            state.literalTab.push(node);
        } else if (node.type === 'MemberExpression') {
            if (node.property && node.property.type === 'Literal') {
                // numeric array subscripts are ineligable
                return;
            }
        } else if (node.type === 'CallExpression') {
            if (node.callee && node.callee.property && node.callee.property.name && node.callee.property.name !== 'out') {
                state.functionTab.push(node);
            }
        }
        // Call the parent's `go` method
        this.super.go.call(this, node, state);
      }
    });

    let state = {};
    state.literalTab = [];
    state.functionTab = [];

    traveler.go(ast, state);

    this.litCount = state.literalTab.length;
    this.funCount = state.functionTab.length;
    if (this.litCount !== this.initialVector.length) {
        let nextVect = [];
        for(let i = 0; i < this.litCount; ++i) {
            nextVect.push(state.literalTab[i].value);
        }
        this.initialVector = nextVect;
    }
    if (options.changeTransform) {
    	this.glitchTrans(state, options);
    }
    else this.glitchLiteral(state, options);

}

	glitchLiteral(state, options)
	{
		let litx = 0;
    if (options.reroll) {
        if (this.lastLitX !== undefined) {
            litx = this.lastLitX;
        }
    } else {
        litx = Math.floor(Math.random() * this.litCount);
        this.lastLitX = litx;
    }

    let modLit = state.literalTab[litx];
    if (modLit) {
        // let glitched = this.glitchNumber(modLit.value);
        let glitched = this.glitchRelToInit(modLit.value, this.initialVector[litx]);
        let was = modLit.raw;
        modLit.value = glitched;
        modLit.raw = "" + glitched;
        console.log("Literal: " + litx + " changed from: " + was + " to: " + glitched);
    }
	}

  glitchNumber(num) {
    if (num === 0) {
        num = 1;
    }
    let range = num * 2;
    let rndVal = Math.round(Math.random() * range * 1000) / 1000;
    return rndVal;
  }

  glitchRelToInit(num, initVal) {
    if (initVal === undefined) {
        return glitchNumber(num);
    } if (initVal === 0) {
        initVal = 0.5;
    }

    let rndVal = Math.round(Math.random() * initVal * 2 * 1000) / 1000;
    return rndVal;
}
	glitchTrans(state, options)
	{
/*
		state.functionTab.forEach((f)=>{
			console.log(f.callee.property.name);
		});
*/
		let funx = Math.floor(Math.random() * this.funCount);
		if (state.functionTab[funx] === undefined || state.functionTab[funx].callee === undefined || state.functionTab[funx].callee.property === undefined) {
				  	console.log("No valid functionTab for index: " + funx);
	  				return;
		}
		let oldName = state.functionTab[funx].callee.property.name;

	  if (oldName == undefined) {
	  	console.log("No name for callee");
	  	return;
	  }
		let ftype = this.transMap[oldName].type;
		if (ftype == undefined) {
			console.log("ftype undefined for: " + oldName);
			return;
		}
		let others = this.funcTab[ftype];
		if (others == undefined) {
			console.log("no funcTab entry for: " + ftype);
			return;
		}
		let changeX = Math.floor(Math.random() * others.length);
		let become = others[changeX].name;

		// check blacklisted combinations.
		if (oldName === "modulate" && become === "modulateScrollX")
		{
			console.log("Function: " + funx + " changing from: " + oldName + " can't change to: " + become);
			return;
		}

		state.functionTab[funx].callee.property.name = become;
    console.log("Function: " + funx + " changed from: " + oldName + " to: " + become);
	}

} //  End of class Mutator.

module.exports = Mutator
