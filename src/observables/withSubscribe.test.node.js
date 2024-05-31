import { test, mock } from 'node:test';
import assert from 'node:assert';
import { withThreeSubscribe as withSubscribe } from './withSubscribe.js';
import { createUnity } from '../unities/createUnity.js';
import { noop } from '../functional.js';

test('has subscribe property', () => {
    const createSubscribable = withSubscribe(createUnity);
    const subscribable = createSubscribable(noop);

    assert.ok(subscribable.subscribe);
});

test('has callable subscribe property with cleanup return value', () => {
    const createSubscribable = withSubscribe(createUnity);

    const subscriber = (next) => {
        const cleanup = noop;
        return cleanup;
    }
    const subscribable = createSubscribable(subscriber);

    const onNext = mock.fn(value => {});
    const cleanup = subscribable.subscribe(onNext)

    assert.strictEqual(onNext.mock.callCount(), 0);
    assert.strictEqual(typeof cleanup, 'function');
});

test('can receive values passed to subscribe', () => {
    const createSubscribable = withSubscribe(createUnity);

    const subscriber = (next) => {
        next(1);
        next(2);
        next(3);

        return noop;
    }
    const subscribable = createSubscribable(subscriber);

    const onNext = mock.fn(value => {});
    const cleanup = subscribable.subscribe(onNext);

    assert.strictEqual(onNext.mock.callCount(), 3);
});
