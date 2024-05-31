import { test, mock } from 'node:test';
import assert from 'node:assert';
import { createUnity } from './createUnity.js';
// import { terseCreateUnity as createUnity } from './createUnity.js';
import { identity, noop } from '../functional.js';
import { withBehavior } from './withBehavior.js';


export const terseWithSubscribe = withBehavior((subscriber) => ({
    subscribe: (onNext, ...rest) => subscriber(onNext, ...rest)
}));

test('returns a unity if passed the identity', () => {
    const withIdentity = withBehavior(identity);

    const createUnityWrapped = withIdentity(createUnity);
    const wrapped = createUnityWrapped();

    assert.notStrictEqual(createUnity, createUnityWrapped);
    assert.deepEqual(wrapped, {});
    assert.deepEqual(wrapped, createUnity());
});

test('wraps unity with additional behaviors', () => {
    // Dummy behavior that accepts a callback and composes a method foo
    // into the unity that calls the callback forwarding its parameters
    const withFooCb = withBehavior((create, cb) => ({
        foo: (...args) => cb(...args),
    }));

    const createUnityFooable = withFooCb(createUnity);
    const spy = mock.fn(identity);
    const fooable = createUnityFooable(spy);

    assert.ok(fooable.foo);
    assert.strictEqual(typeof fooable.foo, 'function');

    fooable.foo(1, 2, 3);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[0].arguments[1], 2);
    assert.strictEqual(spy.mock.calls[0].arguments[2], 3);
    assert.strictEqual(spy.mock.calls[0].result, 1);

    fooable.foo('hello', 'world');

    assert.strictEqual(spy.mock.calls[1].arguments[0], 'hello');
    assert.strictEqual(spy.mock.calls[1].arguments[1], 'world');
    assert.strictEqual(spy.mock.calls[1].result, 'hello');
});


test('weird behavior if both use the cb param', () => {
    // Dummy behavior that accepts a callback and composes a method foo
    // into the unity that calls the callback forwarding its parameters
    const withFooCb = withBehavior((create, onNext) => ({
        foo: (...args) => {
            console.log('Fooable#foo called with ', args.join(','));
            return onNext(...args);
        }
    }));

    const withBarCb = withBehavior((createFooable, onNext, onOtherNext) => {
        const fooable = createFooable(onNext);

        return ({
            ...fooable,
            bar: (...args) => onOtherNext(fooable.foo(...args))
        })
    });

    const createUnityFooBarable = withBarCb(withFooCb(createUnity));
    const onNextSpy = mock.fn(identity);
    const onOtherNextSpy = mock.fn(identity);
    const fooBarable = createUnityFooBarable(onNextSpy, onOtherNextSpy);

    assert.ok(fooBarable.foo);
    assert.ok(fooBarable.bar);
    assert.strictEqual(typeof fooBarable.foo, 'function');
    assert.strictEqual(typeof fooBarable.bar, 'function');

    fooBarable.bar(1);
    fooBarable.bar(2);
    fooBarable.bar(3);

    assert.strictEqual(onOtherNextSpy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(onOtherNextSpy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(onOtherNextSpy.mock.calls[2].arguments[0], 3);

    // Shit gets weird
    fooBarable.bar('hello');
    fooBarable.bar('world');

    assert.strictEqual(onOtherNextSpy.mock.calls[3].arguments[0], 'hello');
    assert.strictEqual(onOtherNextSpy.mock.calls[4].arguments[0], 'world');
});
