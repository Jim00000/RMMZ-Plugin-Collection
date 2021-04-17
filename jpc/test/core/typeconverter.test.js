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
});
