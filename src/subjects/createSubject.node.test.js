
import { test, mock } from 'node:test';
import assert from 'node:assert';
import { createSubject } from './createSubject.js';

test('has subscribe property', () => {
    const { stream$ } = createSubject();

    assert.ok(stream$.subscribe);
    assert.ok(stream$.pipe);
});

test('can be subscribed to', () => {
    const { stream$, next } = createSubject();

    const spy = mock.fn();
    stream$.subscribe(spy);

    next(1);
    next(2);
    next(3);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1)
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2)
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3)
    assert.strictEqual(spy.mock.callCount(), 3);
});

test('can be subscribed to 2x with same events', () => {
    const { stream$, next } = createSubject();

    const spy = mock.fn();
    const spy2 = mock.fn();
    stream$.subscribe(spy);
    stream$.subscribe(spy2);

    next(1);
    next(2);
    next(3);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 3);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy2.mock.callCount(), 3);

});

test('can be subscribed to 2x with different subset', () => {
    const { stream$, next } = createSubject();

    const spy = mock.fn();
    const spy2 = mock.fn();
    stream$.subscribe(spy);

    next(1);
    stream$.subscribe(spy2);
    next(2);
    next(3);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 3);

    assert.strictEqual(spy2.mock.calls[0].arguments[0], 2);
    assert.strictEqual(spy2.mock.calls[1].arguments[0], 3);
    assert.strictEqual(spy2.mock.callCount(), 2);
});


test('can be unsubscribed to 2x with different subset', () => {
    const { stream$, next } = createSubject();

    const spy = mock.fn();
    const spy2 = mock.fn();
    stream$.subscribe(spy);

    next(1);
    const unsubscribe = stream$.subscribe(spy2);
    next(2);
    unsubscribe();
    next(3);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 3);

    assert.strictEqual(spy2.mock.calls[0].arguments[0], 2);
    assert.strictEqual(spy2.mock.callCount(), 1);
});
