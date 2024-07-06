import { test, mock } from 'node:test';
import assert from 'node:assert';
import { identity, noop } from '../functional.js';
import { last } from './last.js';
import { createObservable } from '../observables/createObservable.js';

test('pipe with last gets last item', () => {
    const pipeable = createObservable((next, error, complete) => {
        next(1);
        next(2);
        next(3);

        complete();

        return noop;
    });

    const spy = mock.fn(identity);
    const cleanup = pipeable.pipe(last()).subscribe(spy)

    assert.strictEqual(spy.mock.calls[0].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 1);
    assert.strictEqual(typeof cleanup, 'function');
});
