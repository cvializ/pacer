import { test, mock } from 'node:test';
import assert from 'node:assert';
import { noop } from '../functional.js';
import { createSubscribable } from './createSubscribable.js';
import { createUnsubscribable } from './createUnsubscribable.js';

test('has subscribe property', () => {
    const subscribable = createUnsubscribable(noop);

    assert.ok(subscribable.subscribe);
});

test('has callable subscribe property with cleanup return value', () => {
    const subscriber = (next) => {
        const cleanup = noop;
        return cleanup;
    }
    const subscribable = createUnsubscribable(subscriber);

    const onNext = mock.fn(value => {});
    const cleanup = subscribable.subscribe(onNext)

    assert.strictEqual(onNext.mock.callCount(), 0);
    assert.strictEqual(typeof cleanup, 'function');
});

test('can receive values passed to subscribe', () => {
    let next;
    const subscriber = (n) => {
        next = n;

        return noop;
    }
    const subscribable$ = createUnsubscribable(subscriber);

    const spy = mock.fn(value => {});
    const unsubscribe = subscribable$.subscribe(spy);

    next(1);
    next(2);
    next(3);

    unsubscribe();

    next(4);
    next(5);
    next(6);

    assert.strictEqual(spy.mock.callCount(), 3);
});
