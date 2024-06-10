import { test, mock } from 'node:test';
import assert from 'node:assert';
import { withThreeSubscribe as withSubscribe } from './withSubscribe.js';
import { createUnity } from '../unities/createUnity.js';
import { noop } from '../functional.js';
import { withUnsubscribe } from './withUnsubscribe.js';
import { withPipe } from '../operators/withPipe.js';

test('has subscribe property', () => {
    const createSubscribableWithUnsubscribe = withUnsubscribe(withPipe(withSubscribe(createUnity)));
    const subscribable = createSubscribableWithUnsubscribe(noop);

    assert.ok(subscribable.subscribe);
});

test('has callable subscribe property with cleanup return value', () => {
    const createSubscribable = withUnsubscribe(withPipe(withSubscribe(createUnity)));

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
    const createSubscribable = withUnsubscribe(withPipe(withSubscribe(createUnity)));

    let next;
    const subscriber = (n) => {
        next = n;

        return noop;
    }
    const subscribable$ = createSubscribable(subscriber);

    const onNext = mock.fn(value => {});
    const unsubscribe = subscribable$.subscribe(onNext);

    next(1);
    next(2);
    next(3);

    unsubscribe();

    next(4);
    next(5);
    next(6);

    assert.strictEqual(onNext.mock.callCount(), 3);
});
