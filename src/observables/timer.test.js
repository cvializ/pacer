import { test, mock } from 'node:test';
import assert from 'node:assert';
import { timer } from './timer.js';
import { identity } from '../functional.js';

test('returns a pipeable and does not run', (context) => {
    context.mock.timers.enable();

    const timer$ = timer(1000);

    context.mock.timers.tick(1000);

    assert.ok(timer$.pipe);
    assert.ok(timer$.subscribe);
});


test('emits after each interval', (context) => {
    context.mock.timers.enable();

    const timer$ = timer(1000);

    const spy = mock.fn(identity);
    timer$.subscribe(spy);

    context.mock.timers.tick(1000);
    assert.strictEqual(spy.mock.callCount(), 1);

    context.mock.timers.tick(1000);
    assert.strictEqual(spy.mock.callCount(), 2);
});
