import test from 'node:test';
import assert from 'node:assert';
import { createUnity } from './createUnity.js';
import { terseCreateUnity as createUnity } from './createUnity.js';

test('deep-equality to object', (t) => {
    const unity = createUnity();

    assert.deepEqual(unity, {});
});

test('inequality to other unity', (t) => {
    const unity = createUnity();
    const other = createUnity();

    assert.notStrictEqual(unity, other);
});
