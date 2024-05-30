import { createObservable } from './observable.js';
import { noop } from './functional.js';

export const tap = (cb) => (source$) => {
    return createObservable((next, error, complete) => {
        const unsubscribe = source$.subscribe((value) => {
            cb(value);
            next(value);
        }, error, complete);

        return () => unsubscribe();
    });
};

export const scan = (cb, seed) => source$ => {
    return createObservable((next, error, complete) => {
        let accumulator = seed;

        const unsubscribe = source$.subscribe((value) => {
            accumulator = cb(accumulator, value);
            next(accumulator);
        }, error, complete);

        return () => unsubscribe();
    });
};

export const map = (cb) => (source$) => {
    return createObservable((next, error, complete) => {
        const unsubscribe = source$.subscribe((value) => {
            next(cb(value));
        }, error, complete);

        return () => unsubscribe();
    });
};

export const filter = (condition) => source$ => {
    return createObservable((next, error, complete) => {
        const unsubscribe = source$.subscribe((value) => {
            if (condition(value)) {
                next(value);
            }
        }, error, complete);

        return () => unsubscribe();
    });
};

export const bufferQueue = (length) => (source$) => {
    return createObservable((next, error, complete) => {
        const buffer = [];

        const unsubscribe = source$.subscribe((value) => {
            buffer.unshift(value);

            if (buffer.length === 1) {
                return;
            }

            if (buffer.length > length) {
                buffer.pop();
            }

            next(buffer);
        }, error, complete);

        return () => unsubscribe();
    });
}

export const pairwise = () => (source$) => {
    return source$.pipe(bufferQueue(2));
}
