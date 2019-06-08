const {Parser} = require("acorn");
const {generate} = require('astring');

class Mutator {

  constructor(editor) {
	this.editor = editor;
  }

  back(inst) {
	console.log("back");
  }

  mutate(inst) {
  	// Get text
  	let text = this.editor.cm.getValue();
	// Parse to AST
	let ast = Parser.parse(text);

	// Modify the AST.


	// Generate JS from AST and set back into CodeMirror editor.
	let regen = generate(ast);
	this.editor.cm.setValue(regen);

	// Evaluate the updated expression.
	this.editor.evalAll((code, error) => {
		console.log('evaluated', code, error);
	});
  }

  modify(inst) {
	console.log("modify");
  }

  popMod(inst) {
	console.log("popMod");
  }

}

module.exports = Mutator
