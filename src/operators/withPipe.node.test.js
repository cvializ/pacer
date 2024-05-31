import { test, mock } from 'node:test';
import assert from 'node:assert';
import { withPipe } from './withPipe.js';
import { createUnity } from '../unities/createUnity.js';
import { withSubscribe } from '../observables/withSubscribe.js';
import { identity as identityOperator } from './identity.js';
import { identity, noop } from '../functional.js';

test('pipe with identityOperator forwards values as-is', () => {
    const createPipeable = withPipe(withSubscribe(createUnity));
    const pipeable = createPipeable(next => {
        next(1);
        next(2);
        next(3);

        return noop;
    });

    const spy = mock.fn(identity);
    const cleanup = pipeable.pipe(identityOperator()).subscribe(spy)

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 3);
    assert.strictEqual(cleanup, noop);
});
