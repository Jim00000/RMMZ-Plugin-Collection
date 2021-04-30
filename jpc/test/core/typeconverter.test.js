const chai = require('chai');
import {__typeconverter as converter} from '../../core/typeconverter';
const expect = chai.expect;

describe('typeconverter.test.js', function() {
    describe('toBoolean()', function() {
        this.slow(10);      // 10ms
        this.timeout(100);  // 100ms

        // ---------- trivial test ----------

        it('true → true', function() {
            expect(converter.toBoolean(true)).deep.equal(true);
        });

        it('false → false', function() {
            expect(converter.toBoolean(false)).deep.equal(false);
        });

        // ---------- number to boolean test ----------

        it('0 → false', function() {
            expect(converter.toBoolean(0)).deep.equal(false);
        });

        it('0.0 → false', function() {
            expect(converter.toBoolean(0.0)).deep.equal(false);
        });

        it('1 → true', function() {
            expect(converter.toBoolean(1)).deep.equal(true);
        });

        it('1.0 → true', function() {
            expect(converter.toBoolean(1.0)).deep.equal(true);
        });

        it('-1.0 → null', function() {
            expect(converter.toBoolean(-1.0)).deep.equal(null);
        });

        // ---------- string to boolean test ----------

        it('"true" → true', function() {
            expect(converter.toBoolean('true')).deep.equal(true);
        });

        it('"false" → false', function() {
            expect(converter.toBoolean('false')).deep.equal(false);
        });

        it('"false_case" → null', function() {
            expect(converter.toBoolean('false_case')).deep.equal(null);
        });

        // ---------- string array to boolean array test ----------

        it('[] → []', function() {
            expect(converter.toBoolean([])).deep.have.ordered.members([]);
        });

        it('["true"] → [true]', function() {
            expect(converter.toBoolean(['true'])).deep.have.ordered.members([true]);
        });

        it('["true", "false", "true", "false"] → [true, false, true, false]', function() {
            expect(converter.toBoolean(['true', 'false', 'true', 'false'])).deep.have.ordered.members([
                true, false, true, false
            ]);
        });

        it('["true", "false_case", "false"] → [true, null, false]', function() {
            expect(converter.toBoolean(['true', 'false_case', 'false'])).deep.have.ordered.members([true, null, false]);
        });

        it('[true, 0.0, 1.32, "hello world", "false", [true, false, [true , [true, false, null], false]]] → [true, false, null, null, false, [true, false, [true, [true, false, null], false]]]',
           function() {
               expect(converter.toBoolean(
                          [true, 0.0, 1.32, 'hello world', 'false', [true, false, [true, [true, false, null], false]]]))
                   .deep.have.ordered.members(
                       [true, false, null, null, false, [true, false, [true, [true, false, null], false]]]);
           });
    });

    describe('toNumber()', function() {
        this.slow(10);      // 10ms
        this.timeout(100);  // 100ms

        // ---------- trivial test ----------

        it('undefined → assertion', function() {
            expect(() => converter.toNumber(undefined)).to.throw(TypeError);
        });

        it('null → null', function() {
            expect(converter.toNumber(null)).deep.equal(null);
        });

        it('{} → throw TypeError', function() {
            expect(() => converter.toNumber({})).to.throw(TypeError);
        });

        it('153 → 153', function() {
            expect(converter.toNumber(153)).deep.equal(153);
        });

        it('246.3 → 246.3', function() {
            expect(converter.toNumber(246.3)).deep.equal(246.3);
        });

        // ---------- boolean to number test ----------

        it('true → 1', function() {
            expect(converter.toNumber(true)).deep.equal(1);
        });

        it('false → 0', function() {
            expect(converter.toNumber(false)).deep.equal(0);
        });

        // ---------- string to number test ----------

        it('"12345" → 12345', function() {
            expect(converter.toNumber('12345')).deep.equal(12345);
        });

        it('"123.456" → 123.456', function() {
            expect(converter.toNumber('123.456')).deep.equal(123.456);
        });

        it('"4.354e+7" → 43540000', function() {
            expect(converter.toNumber('4.354e+7')).deep.equal(43540000);
        });

        it('"not_a_number" → null', function() {
            expect(converter.toNumber('not_a_number')).deep.equal(null);
        });

        // ---------- string array to number array test ----------

        it('[] → []', function() {
            expect(converter.toNumber([])).deep.have.ordered.members([]);
        });

        it('[true, "125.6"] → [1, 125.6]', function() {
            expect(converter.toNumber([true, '125.6'])).deep.have.ordered.members([1, 125.6]);
        });

        it('["1", "2", ["3", 4, [5, [6]]]] → [1, 2, [3, 4, [5, [6]]]]', function() {
            expect(converter.toNumber(['1', '2', ['3', 4, [5, [6]]]])).deep.have.ordered.members([
                1, 2, [3, 4, [5, [6]]]
            ]);
        });
    });

    describe('toString()', function() {
        this.slow(10);      // 10ms
        this.timeout(100);  // 100ms

        // ---------- trivial test ----------

        it('undefined → assertion', function() {
            expect(() => converter.toString(undefined)).to.throw(TypeError);
        });

        it('null → null', function() {
            expect(converter.toString(null)).deep.equal(null);
        });

        it('{} → throw TypeError', function() {
            expect(() => converter.toString({})).to.throw(TypeError);
        });

        it('"Hello World" → "Hello World"', function() {
            expect(converter.toString('Hello World')).deep.equal('Hello World');
        });

        // ---------- boolean to string ----------

        it('true → "true"', function() {
            expect(converter.toString(true)).deep.equal('true');
        });

        it('false → "false"', function() {
            expect(converter.toString(false)).deep.equal('false');
        });

        // ---------- number to string ----------

        it('153 → 153', function() {
            expect(converter.toString(153)).deep.equal('153');
        });

        it('246.3 → 246.3', function() {
            expect(converter.toString(246.3)).deep.equal('246.3');
        });

        // ---------- array to string array test ----------

        it(`[true, 3.14, 'Hello'] → ['true', '3.14', 'Hello']`, function() {
            expect(converter.toString([true, 3.14, 'Hello'])).deep.have.ordered.members(['true', '3.14', 'Hello']);
        });

        it(`[[1], [2, [3, 4], [5]], [6, 7, [8, 9]]] → [['1'], ['2', ['3', '4'], ['5']], ['6', '7', ['8', '9']]]`,
           function() {
               expect(converter.toString([[1], [2, [3, 4], [5]], [6, 7, [8, 9]]])).deep.have.ordered.members([
                   ['1'], ['2', ['3', '4'], ['5']], ['6', '7', ['8', '9']]
               ]);
           });
    });
});
