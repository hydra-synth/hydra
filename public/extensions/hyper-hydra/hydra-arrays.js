window.hydraArrays = {};

hydraArrays.newOperator = function (self, f) {
    return function (arr) {
        for (let i = 0; i < self.length; i++) {
            if (Array.isArray(arr)) {
                self[i] = arr[i] ? f(self[i], arr[i]) : self[i];
            } else {
                self[i] = f(self[i], arr);
            }
        }
        return self;
    };
};
hydraArrays.newWrapOperator = function (self, f) {
    return function (arr) {
        for (let i = 0; i < self.length; i++) {
            if (Array.isArray(arr)) {
                self[i] = f(self[i], arr[i % arr.length]);
            } else {
                self[i] = f(self[i], arr);
            }
        }
        return self;
    };
};

// operators
{
    const operators = {
        add: (x, y) => x + y,
        sub: (x, y) => x - y,
        div: (x, y) => x / y,
        mult: (x, y) => x * y,
        mod: (x, y) => x % y,
    };
    Object.entries(operators).forEach(function ([op, f]) {
        Array.prototype[op] = function (arr) {
            return hydraArrays.newOperator(this, f)(arr);
        };
        Array.prototype[op + "Wrap"] = function (arr) {
            return hydraArrays.newWrapOperator(this, f)(arr);
        };
    });
}

// methods
Array.prototype.shuffle = function () {
    return this.sort(() => Math.random() - 0.5);
};
Array.prototype.zfill = function (l, z = 0) {
    const _l = this.length;
    for (let i = 0; i < l - _l; i++) this.push(z);
    return this;
};
Array.prototype.rotate = function (n) {
    const len = this.length;
    this.push(...this.splice(0, ((-n % len) + len) % len));
    return this;
};
Array.prototype.rot = Array.prototype.rotate;

// generators
Array.random = function (l = 10, min = 0, max = 1) {
    return Array.from(
        { length: l },
        () => Math.random() * (max - min) + min
    );
};
Array.range = function (start, end, step = 1) {
    if (step === 0) return [];
    const length = Math.ceil((end - start) / step);
    return Array.from({ length }, (_, i) => start + i * step).filter(
        (n) => n <= end
    );
};
Array.run = function (end = 10, step = 1) {
    return Array.range(0, end, step);
};
