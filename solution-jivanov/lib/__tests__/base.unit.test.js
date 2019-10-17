const Base = require('../base.js');

describe("Testing Base.js class", () => {

    test('constructor()', () => {
        expect(new Base).toBeTruthy();
    });

    // isNumeric() should return True for numbers, False otherwise
    test.each([
            [1, true], [-10, true], [0, true], // numbers
            ['2', true], ['-20', true], ['0', true], // strings
            ['a3', false], ['3a', false], ['-30b', false], // strings failing tests
            [true, false], [false, false], ['true', false], ['false', false], // booleans/strings should be false
            ['', false], [null, false], ['null', false], [NaN, false] // some other edge cases
    ])(
        'isNumeric(%s) is %s', (a, expected) => {
            expect(Base.isNumeric(a)).toBe(expected);
        },
    );

    // isString() should return True for strings, False otherwise
    test.each([
        [1, false], [-10, false], [0, false], // numbers
        ['2', true], ['-20', true], ['0', true], // strings
        ['a3', true], ['3a', true], ['-30b', true], // strings again
        ['true', true], ['false', true], // strings again
        [true, false], [false, false], // booleans are not strings
        [new String( "This is a String Object" ), true], // it is still a string
        ['', true], [null, false], ['null', true], [NaN, false], ['NaN', true] // some other edge cases
    ])(
        'isString(%s) is %s', (a, expected) => {
            expect(Base.isString(a)).toBe(expected);
        },
    );

    // isFunction() should return True for functions, False otherwise
    test.each([
        [function f(){}, true], [()=> 1, true], [function(){}, true], [(a,b) => 1, true],// functions
        [1, false], [-10, false], [0, false], // numbers
        ['2', false], ['-20', false], ['0', false], // strings
        [new String( "This is a String Object" ), false], [{}, false], // objects
        [true, false], [false, false], ['true', false], ['false', false], // booleans/strings should be false
        ['', false], [null, false], ['null', false], [NaN, false] // some other edge cases
    ])(
        'isFunction(%s) is %s', (a, expected) => {
            expect(Base.isFunction(a)).toBe(expected);
        },
    );

    // isObject() should return True for objects, False otherwise
    test.each([
        [new Object(), true], [{}, true], // objects
        [new String( "This is a String Object" ), true], [new function() {}, true], // objects
        [1, false], [-10, false], [0, false], // numbers
        ['2', false], ['-20', false], ['0', false], // strings
        [true, false], [false, false], ['true', false], ['false', false], // booleans/strings should be false
        ['', false], [null, false], ['null', false], [NaN, false] // some other edge cases
    ])(
        'isObject(%s) is %s', (a, expected) => {
            expect(Base.isObject(a)).toBe(expected);
        },
    );

    // isEmptyObject() should return True for empty objects, False otherwise (including if not an object at all)
    test.each([
        [new Object(), true], [{}, true], [new function() {}, false] ,// empty objects
        [new String( "This is a String Object" ), false], [{a:1}, false], // non-empty objects
        [1, false], [-10, false], [0, false], // numbers
        ['2', false], ['-20', false], ['0', false], // strings
        [true, false], [false, false], ['true', false], ['false', false], // booleans/strings should be false
        ['', false], [null, false], ['null', false], [NaN, false] // some other edge cases
    ])(
        'isEmptyObject(%s) is %s', (a, expected) => {
            expect(Base.isEmptyObject(a)).toBe(expected);
        },
    );

});