import test from 'node:test';
import assert from 'node:assert';
import { withIdentity } from './withIdentity.js';
import { createUnity } from './createUnity.js';

test('deep-equality to object', () => {
    const create = withIdentity(createUnity);
    const unity = create();

    assert.deepEqual(unity, {});
});

test('inequality to wrapped unity', () => {
    const unity = createUnity();
    const wrappedCreateUnity = withIdentity(createUnity);
    const wrappedUnity = wrappedCreateUnity();

    assert.notStrictEqual(unity, wrappedUnity);
});

test('inequality of wrapped creator', () => {
    const wrappedCreateUnity = withIdentity(createUnity);

    assert.notStrictEqual(createUnity, wrappedCreateUnity);
});
