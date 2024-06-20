import { test, mock } from "node:test";
import assert from "node:assert";
import { withPipe } from "./withPipe.js";
import { createUnity } from "../unities/createUnity.js";
import { withSubscribe } from "../observables/withSubscribe.js";
import { identity, noop } from "../functional.js";
import { of } from "../observables/of.js";
import { mergeAll } from "./mergeAll.js";
import { concatAll } from "./concatAll.js";
import { createObservable } from "../observables/createObservable.js";
import { createPipeable } from "./createPipeable.js";

test("flattens an observable of observables", () => {
    const pipeable = createPipeable((next) => {
        next(of(1));
        next(of(2));
        next(of(3));

        return noop;
    });

    const spy = mock.fn(identity);
    const cleanup = pipeable.pipe(concatAll()).subscribe(spy);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 3);
});


test("emits complete only after all have completed", () => {
    let next1;
    let complete1;
    const observable1$ = createObservable((n, e, c) => {
        next1 = n;
        complete1 = c;
    })

    let next2;
    let complete2;
    const observable2$ = createObservable((n, e, c) => {
        next2 = n;
        complete2 = c;
    });

    // DOES NOT WORK WITH PIPEABLE. TODO: MAKE A TEST SHOWING THAT!
    let completeSource;
    const observable$ = createObservable((next, e, c) => {
        completeSource = c;

        next(observable1$);
        next(observable2$);
    });

    const nextSpy = mock.fn(identity);
    const completeSpy = mock.fn(identity);
    const cleanup = observable$.pipe(concatAll()).subscribe(nextSpy, noop, completeSpy);

    next1(1);
    assert.strictEqual(nextSpy.mock.callCount(), 1);
    assert.strictEqual(typeof next2, 'undefined');
    assert.strictEqual(typeof complete2, 'undefined');
    assert.strictEqual(completeSpy.mock.callCount(), 0);

    complete1(1);
    assert.strictEqual(typeof next2, 'function');
    assert.strictEqual(typeof complete2, 'function');
    assert.strictEqual(completeSpy.mock.callCount(), 0);

    next2(2);
    assert.strictEqual(nextSpy.mock.callCount(), 2);
    assert.strictEqual(completeSpy.mock.callCount(), 0);

    complete2();
    assert.strictEqual(nextSpy.mock.callCount(), 2);
    assert.strictEqual(completeSpy.mock.callCount(), 0);

    completeSource();
    assert.strictEqual(nextSpy.mock.callCount(), 2);
    assert.strictEqual(completeSpy.mock.callCount(), 1);
});
