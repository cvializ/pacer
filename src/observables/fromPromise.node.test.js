import { test, mock } from 'node:test';
import assert from 'node:assert';
import { fromPromise } from './fromPromise.js';
import { identity } from '../functional.js';

test('Emits next and complete for a resolved promise', (done) => {
    const promiseGetter = () => Promise.resolve(1);

    const spy = mock.fn(identity);
    const cleanup = fromPromise(promiseGetter).subscribe(value => {
        spy(value);
    }, e => {
        assert.fail(e);
    }, () => {
        // assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
        // // assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
        // // assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
        // assert.strictEqual(spy.mock.callCount(), 1);
        // assert.strictEqual(cleanup, noop);

        done();
    });
});

test('Emits error for a rejected promise', (done) => {
    const promiseGetter = () => Promise.reject(new Error('rejected'));

    const spy = mock.fn(identity);
    const cleanup = fromPromise(promiseGetter).subscribe(value => {
        assert.fail(value);
    }, e => {
        assert.fail(e);

        // assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
        // // assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
        // // assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
        // assert.strictEqual(spy.mock.callCount(), 1);
        // assert.strictEqual(cleanup, noop);

        done();
    }, () => {
        assert.fail('complete should not be fired');
    });
});
