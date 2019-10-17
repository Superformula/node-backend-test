// base.js
// Base class - useful, common routines

'use strict';

class Base {
    constructor() {
    }

    static log(...args)
    {
        console.log(args);
    }

    // returns true if n is numeric, false otherwise
    //based on: http://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers
    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    // returns true if s is a string, false otherwise
    // based on: https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string (3rd answer)
    static isString(s) {
        return Object.prototype.toString.call(s) === "[object String]";
    }

    // returns true if f is a function, false otherwise
    static isFunction(f) {
        return Object.prototype.toString.call(f) === "[object Function]";
    }

    // returns true if obj is an object, false otherwise
    //based on: http://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
    static isObject(obj) {
        return obj === Object(obj);
    }

    // returns true if an object is empty i.e. {}
    // false if not empty or not an object at all
    static isEmptyObject(obj) {
        return (this.isObject(obj) && Object.keys(obj).length === 0 && obj.constructor === Object);
    }
};

module.exports = Base;
