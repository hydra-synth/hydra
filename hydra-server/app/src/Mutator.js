const {Parser} = require("acorn");
const {generate} = require('astring');
const { defaultTraveler, attachComments, makeTraveler } = require('astravel');
const {UndoStack} = require('./UndoStack.js');


class Mutator {

  constructor(editor) {
	this.editor = editor;
	this.undoStack = new UndoStack();
	
	this.initialVector = [];
  }


  mutate(options) {
  	// Get text from CodeMirror.
  	let text = this.editor.cm.getValue();
	this.undoStack.push({text, lastLitX: this.lastLitX});

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

	// Evaluate the updated expression.
	this.editor.evalAll((code, error) => {
		// console.log('evaluated', code, error);
	});
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
	this.editor.evalAll((code, error) => {
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
			state.push(node);
		} else if (node.type === 'MemberExpression') {
			if (node.property && node.property.type === 'Literal') {
				// numeric array subscripts are ineligable 
				return;
			}
		}
		// Call the parent's `go` method
		this.super.go.call(this, node, state);
	  }
	});

	let literalTab = [];
	traveler.go(ast, literalTab);

	let litCount = literalTab.length;
	if (litCount > 0) {
		if (litCount !== this.initialVector.length) {
			let nextVect = [];
			for(let i = 0; i < litCount; ++i) {
				nextVect.push(literalTab[i].value);
			}
			this.initialVector = nextVect;
		}
		let litx = 0;
		if (options.reroll) {
			if (this.lastLitX !== undefined) {
				litx = this.lastLitX;
			}
		} else {
			litx = Math.round(Math.random() * litCount);
			this.lastLitX = litx;
		}
		let modLit = literalTab[litx];
		if (modLit) {
			// let glitched = this.glitchNumber(modLit.value);
			let glitched = this.glitchRelToInit(modLit.value, this.initialVector[litx]);
			let was = modLit.raw;
			modLit.value = glitched;
			modLit.raw = "" + glitched;
			console.log("Literal: " + litx + " changed from: " + was + " to: " + glitched);
		}
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
} //  End of class Mutator.

module.exports = Mutator
