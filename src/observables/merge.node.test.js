import { test, mock } from 'node:test';
import assert from 'node:assert';
import { merge } from './merge.js';
import { createPipeable } from '../operators/createPipeable.js';
import { noop } from '../functional.js';

const of = scalar => createPipeable(next => next(scalar));

test('returns a pipeable', () => {
    const merged$ = merge(of(1));

    assert.ok(merged$.pipe);
    assert.ok(merged$.subscribe);
});


test('subscribes and emits its arguments values', () => {
    const merged$ = merge(of(1), of(2), of(3));

    const spy = mock.fn(value => assert.ok(value));

    merged$.subscribe(spy);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 3);
});


test('subscribes and emits nested observable values', () => {
    const first$ = merge(of(1), of(2), of(3));
    const second$ = merge(of(4), of(5), of(6));

    const merged$ = merge(first$, second$);

    const spy = mock.fn(value => assert.ok(value));

    merged$.subscribe(spy);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.calls[3].arguments[0], 4);
    assert.strictEqual(spy.mock.calls[4].arguments[0], 5);
    assert.strictEqual(spy.mock.calls[5].arguments[0], 6);
    assert.strictEqual(spy.mock.callCount(), 6);
});


// test('unsubscribes ???', () => {
//     let nextOne;
//     const puppetOne$ = createPipeable((n) => {
//         nextOne = n;
//         return noop;
//     });

//     let nextTwo;
//     const puppetTwo$ = createPipeable((n) => {
//         nextTwo = n;
//         return noop;
//     });

//     const merged$ = merge(puppetOne$, puppetTwo$);

//     const spy = mock.fn(value => assert.ok(value));

//     const unsubscribe = merged$.subscribe(spy);

//     nextOne(1);
//     nextTwo(2);
//     nextOne(3);

//     unsubscribe();

//     nextTwo(4);
//     nextOne(5);
//     nextTwo(6);


//     assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
//     assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
//     assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
//     assert.strictEqual(spy.mock.calls[3].arguments[0], 4);
//     assert.strictEqual(spy.mock.calls[4].arguments[0], 5);
//     assert.strictEqual(spy.mock.calls[5].arguments[0], 6);
//     assert.strictEqual(spy.mock.callCount(), 3);
// });
