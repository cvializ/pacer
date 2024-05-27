import { createObservable } from './observable.js';
import { noop } from './functional.js';

export const tap = (cb) => (source$) => {
    return createObservable((next, error, complete) => {
        source$.subscribe((value) => {
            cb(value);
            next(value);
        }, error, complete);

        return noop;
    });
};

export const scan = (cb, seed) => source$ => {
    return createObservable((next, error, complete) => {
        let accumulator = seed;

        source$.subscribe((value) => {
            accumulator = cb(accumulator, value);
            next(accumulator);
        }, error, complete);

        return noop;
    });
};

export const map = (cb) => (source$) => {
    return createObservable((next, error, complete) => {
        source$.subscribe((value) => {
            next(cb(value));
        }, error, complete);

        return noop;
    });
};

export const filter = (condition) => source$ => {
    return createObservable((next, error, complete) => {
        source$.subscribe((value) => {
            if (condition(value)) {
                next(value);
            }
        }, error, complete);

        return noop;
    });
};

export const bufferQueue = (length) => (source$) => {
    return createObservable((next, error, complete) => {
        const buffer = [];

        source$.subscribe((value) => {
            buffer.unshift(value);

            if (buffer.length === 1) {
                return;
            }

            if (buffer.length > length) {
                buffer.pop();
            }

            next(buffer);
        }, error, complete);

        return noop;
    });
}

export const pairwise = () => (source$) => {
    return source$.pipe(bufferQueue(2));
}
