import { test, mock } from 'node:test';
import assert from 'node:assert';
import { fromPromise } from './fromPromise.js';
import { identity } from '../functional.js';

test('Emits next and complete for a resolved promise', (t, done) => {
    const promiseGetter = () => Promise.resolve(1);

    const spy = mock.fn(identity);
    const cleanup = fromPromise(promiseGetter).subscribe(value => {
        spy(value);
    }, e => {
        assert.fail(e);
    }, () => {
        assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
        assert.strictEqual(spy.mock.callCount(), 1);
        assert.ok(cleanup);

        done();
    });
});

test('Emits error for a rejected promise', (t, done) => {
    const promiseGetter = () => Promise.reject(new Error('rejected'));

    const cleanup = fromPromise(promiseGetter).subscribe(value => {
        assert.fail(value);
    }, e => {
        assert.strictEqual(e.message, 'rejected');
        assert.ok(cleanup);
        done();
    }, () => {
        assert.fail('complete should not be fired');
    });
});
