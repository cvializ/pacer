import { test, mock } from "node:test";
import assert from "node:assert";
import { createPollStream } from "./pollStream.js";
import { identity, noop } from "./functional.js";
import { createSubject } from "./subjects/createSubject.js";

test("polls n streams", (t, done) => {
    t.mock.timers.enable();
    t.mock.method(global, 'fetch', () => {
        const mockResponse = {
            json: () => Promise.resolve({ data: 'wow' })
        };
        return Promise.resolve(mockResponse);
    });

    const pollStream$ = createPollStream('/path', 1000);
    const spy = mock.fn(identity);
    const cleanup = pollStream$.subscribe((v) => {
        spy(v);
        assert.strictEqual(spy.mock.callCount(), 1);
        assert.deepEqual(spy.mock.calls[0].arguments[0], { data: 'wow' });
        done();
    }, e => assert.fail(e), () => assert.fail('should not emit complete'));

    t.mock.timers.tick(1000);

    assert.strictEqual(spy.mock.callCount(), 0);
    // assert.strictEqual(spy.mock.calls[0].arguments[0], {});
    // assert.strictEqual(spy.mock.calls[1].arguments[0], {});
    // assert.strictEqual(spy.mock.calls[2].arguments[0], {});
});

const resolveAfterNCalls = (n) => {
    let resolve;
    let callCount = 0;
    const promise = new Promise(res => {
        resolve = res;
    });
    const spy = mock.fn(() => {
        callCount += 1;
        if (callCount === n) {
            resolve();
        }
    });
    return {
        spy,
        promise
    }
};

test.only("subject", async (t) => {
    t.mock.timers.enable();
    t.mock.method(global, 'fetch', () => {
        const mockResponse = {
            json: () => Promise.resolve({ data: 'wow' })
        };
        return Promise.resolve(mockResponse);
    });

    const { spy, promise } = resolveAfterNCalls(2);

    const pollStream$ = createPollStream('/path', 1000);
    const subject$ = createSubject();
    const { next } = subject$;

    // const spy = mock.fn(identity);
    const cleanup = pollStream$.subscribe((v) => {
        next(v);
    }, e => assert.fail(e), () => assert.fail('should not emit complete'));

    subject$.subscribe(spy);

    assert.strictEqual(spy.mock.callCount(), 0);

    t.mock.timers.tick(1000);


    t.mock.timers.tick(1000);

    await promise;

    assert.strictEqual(spy.mock.callCount(), 2);

    // assert.strictEqual(spy.mock.calls[0].arguments[0], {});
    // assert.strictEqual(spy.mock.calls[1].arguments[0], {});
    // assert.strictEqual(spy.mock.calls[2].arguments[0], {});
});
