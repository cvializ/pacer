import { test, mock } from 'node:test';
import assert from 'node:assert';
import { noop } from '../functional.js';
import { createObservable } from './createObservable.js';

test('returns a pipeable', () => {
    const stream$ = createObservable((next) => {});

    assert.ok(stream$.pipe);
    assert.ok(stream$.subscribe);
});


test('subscribes and emits its arguments values', () => {
    let next;
    const stream$ = createObservable((n) => {
        next = n;
        return noop;
     });


    const spy = mock.fn(value => assert.ok(value));

    stream$.subscribe(spy, e => {
        assert.fail(`This test should not throw errors\n${e}`);
    });

    next(1);
    next(2);
    next(3);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 3);
});


test('unsubscribes ???', () => {
    let next;
    const stream$ = createObservable((n) => {
        next = n;
        return noop;
    });

    const spy = mock.fn(value => assert.ok(value));

    const unsubscribe = stream$.subscribe(spy, e => {
        assert.fail(`This test should not throw errors\n${e}`);
    });

    next(1);
    next(2);
    next(3);

    unsubscribe();

    next(4);
    next(5);
    next(6);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 3);
});

test('errors ???', () => {
    let next;
    let error;
    const stream$ = createObservable((n, e) => {
        next = n;
        error = e;
        return noop;
    });

    const spy = mock.fn(value => assert.ok(value));
    const errorSpy = mock.fn(value => assert.ok(value));

    stream$.subscribe(spy, errorSpy);

    next(1);
    next(2);
    next(3);

    error('MY ERROR VALUE');

    next(4);
    next(5);
    next(6);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 3);

    assert.strictEqual(errorSpy.mock.calls[0].arguments[0], 'MY ERROR VALUE');
});

test('completes ???', () => {
    let next;
    let complete;
    const stream$ = createObservable((n, e, c) => {
        next = n;
        complete = c;
        return noop;
    });

    const spy = mock.fn(value => assert.ok(value));

    stream$.subscribe(spy, e => {
        assert.fail(`This test should not throw errors\n${e}`);
    });

    next(1);
    next(2);
    next(3);

    complete();

    next(4);
    next(5);
    next(6);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 3);
});
