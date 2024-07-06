import { test, mock } from 'node:test';
import assert from 'node:assert';
import { of } from './of.js';
import { zip } from './zip.js';
import { noop } from '../functional.js';
import { fromArray } from './fromArray.js';
import { map } from '../operators/map.js';
import { scan } from '../operators/scan.js';

test('zips two observables that emit one item', (context) => {
    const stream$ = zip(of(1), of(2));

    const spy = mock.fn(value => value);

    stream$.subscribe(spy, e => {
        assert.fail(`This test should not throw errors\n${e}`);
    }, noop);

    assert.deepEqual(spy.mock.calls[0].arguments[0], [1, 2]);
    assert.strictEqual(spy.mock.callCount(), 1);
});

test('zips two observables that emit multiple items', (context) => {
    const stream$ = zip(fromArray([1, 3]), fromArray([2, 4]));

    const spy = mock.fn(value => value);

    stream$.subscribe(spy, e => {
        assert.fail(`This test should not throw errors\n${e}`);
    }, noop);

    assert.deepEqual(spy.mock.calls[0].arguments[0], [1, 2]);
    assert.deepEqual(spy.mock.calls[1].arguments[0], [3, 4]);
    assert.strictEqual(spy.mock.callCount(), 2);
});

const isWhitespace = value => !/\w/.test(value); // \s doesn't match empty string
const BEAT_TIME_SECONDS = .2;

test.only('hmmmm', (context) => {
    const a$ = fromArray('X XX  X XX  X XX  '.repeat(1).split(''));

    // a$.subscribe((v) => console.log('next', v), e => console.log('error', e), () => console.log('COMPLETE!'));

    const aGain$ = a$.pipe(
        map(char => isWhitespace(char) ? 0 : 1),
    );
    const aTime$ = a$.pipe(
        map(() => BEAT_TIME_SECONDS),
        scan((acc, d) => (acc * 10 + d * 10) / 10, 0), // floating point math https://www.codemag.com/article/1811041/JavaScript-Corner-Math-and-the-Pitfalls-of-Floating-Point-Numbers
    );
    const stream$ = zip(aGain$, aTime$);

    const spy = mock.fn(value => value);

    stream$.subscribe(spy, e => {
        assert.fail(`This test should not throw errors\n${e}`);
    }, noop);

    assert.deepEqual(spy.mock.calls[0].arguments[0], [1, .2]);
    assert.deepEqual(spy.mock.calls[1].arguments[0], [3, .4]);
    assert.strictEqual(spy.mock.callCount(), 2);
})
