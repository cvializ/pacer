import { test, mock } from "node:test";
import assert from "node:assert";
import { withPipe } from "./withPipe.js";
import { createUnity } from "../unities/createUnity.js";
import { withSubscribe } from "../observables/withSubscribe.js";
import { identity, noop } from "../functional.js";
import { of } from "../observables/of.js";
import { mergeAll } from "./mergeAll.js";

test("flattens an observable of observables", () => {
    const createPipeable = withPipe(withSubscribe(createUnity));
    const pipeable = createPipeable((next) => {
        next(of(1));
        next(of(2));
        next(of(3));

        return noop;
    });

    const spy = mock.fn(identity);
    const cleanup = pipeable.pipe(mergeAll()).subscribe(spy);

    assert.strictEqual(spy.mock.calls[0].arguments[0], 1);
    assert.strictEqual(spy.mock.calls[1].arguments[0], 2);
    assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
    assert.strictEqual(spy.mock.callCount(), 3);
});


// test("emits complete only after all have completed", () => {
//     let complete1;
//     const observable1$ = createObservable((n, e, c) => {
//         complete1 = c;
//     })
//     let complete2;
//     const observable2$ = createObservable((n, e, c) => {
//         complete2 = c;
//     });

//     const pipeable$ = createPipeable(next => {
//         next(observable1$);
//         next(observable2$);
//     });

//     const spy = mock.fn(identity);
//     const cleanup = pipeable$.pipe(mergeAll()).subscribe(noop, noop, spy);

//     complete1();
//     assert.strictEqual(spy.mock.callCount(), 0);
//     complete2();
//     assert.strictEqual(spy.mock.callCount(), 1);
// });
