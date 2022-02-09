// A generalized 'Undo stack' which can keep N levels of revertable state.
class UndoStack {
    constructor(limit) {
        this.stack = [];
        this.index = -1;
        this.limit = limit;
    }
    
    atTop() {
        return this.index === -1;
    }

    canUndo() {
        if(this.stack.length === 0) return false;
        return this.index === -1 || this.index > 0;
    }

    canRedo() {
        if(this.stack.length === 0 || this.index === -1) return false;
        return this.index < this.stack.length - 1;
    }

    push(item) {
        if (this.index >= 0) {
            while (this.index < this.stack.length) this.stack.pop();
            this.index = -1;
        }
        if (this.limit && this.stack.length > this.limit) {
            this.stack.shift();
        }
        this.stack.push(item);
    }

    undo() {
        if (this.stack.length === 0) return undefined;
        if (this.index === -1) { // start one behind the redo buffer
            this.index = this.stack.length - 1;
        }
        if (this.index > 0) this.index--;
        let v = this.stack[this.index];
        return v;
    }

    redo() {
        if (this.stack.length === 0 || this.index === -1) return undefined;
        let nextX = this.index + 1;
        if (nextX >= this.stack.length) return undefined;
        this.index = nextX;
        return this.stack[this.index];
    }
};


module.exports = {UndoStack}