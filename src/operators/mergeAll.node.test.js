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
