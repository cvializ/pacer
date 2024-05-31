
/**
 * Single event single subscriber observables.
 */

import { noop } from "./functional.js";
import { withSubscribe } from "./observables/withSubscribe.js";
import { withPipe } from "./operators/withPipe.js";
import { createUnity } from "./unities/createUnity.js";


const createObservable = withPipe(withSubscribe(createUnity));

const merge = (...sources) => {
    return createObservable((next) => {
        const cleanups = sources.map(source$ => source$.subscribe((value) => {
            next(value);
        }));

        return () => cleanups.forEach(cleanup => cleanup());
    });
};

const merge$ = (sources$) => {
    const unsubscribe$ = createObservable()

    const merged$ = createObservable(next => {
        sources$.subscribe(source$ => {
            source$.subscribe(value => next);
        })
    });
};

const filter = (condition) => source$ => {
    return createObservable((next) => {
        const cleanup = source$.subscribe((value) => {
            if (condition(value)) {
                next(value);
            }
        });

        return cleanup;
    });
};

const scan = (cb, seed) => source$ => {
    return createObservable((next) => {
        let accumulator = seed;

        const cleanup = source$.subscribe((value) => {
            accumulator = cb(accumulator, value);
            next(accumulator);
        });

        return cleanup;
    });
};

const map = (cb) => (source$) => {
    return createObservable((next) => {
        const cleanup = source$.subscribe((value) => {
            next(cb(value));
        });

        return cleanup;
    });
};

const pick = (key) => map(value => value[key]);

const wrapWithKey = (key) => map(value => ({ [key]: value }));

const withUnsubscribe = (create) => (subscriber) => {
    let unsubscribe;
    const unsubscribe$ = createObservable((u) => {
        unsubscribe = () => u(true);

        return () => unsubscribe();
    });

    const observable$ = create((next) => {
        const cleanup = subscriber(next) || noop;

        return () => {
            unsubscribe();
            cleanup();
        };
    });

    return merge(
        unsubscribe$.pipe(wrapWithKey('unsubscribe')),
        observable$.pipe(wrapWithKey('value')),
    ).pipe(
        scan((acc, d) => ({ ...acc, ...d }), {}),
        filter(({ unsubscribe }) => !unsubscribe),
        pick('value'),
    );
};

export const createSingleEventSingleSubscriberObservable =
    withUnsubscribe(
        createObservable);

// let next;
// const o$ = createSingleEventSingleSubscriberObservable((n) => {
//     next = n;
// });

// const unsub = o$.subscribe((value) => {
//     if (value === 2) {
//         unsub();
//     }

//     console.log('VALUE', value);
// })

// next(1);
// next(2);
// next(3);

// const value$ = createSingleEventObservable((next) => {
//     next('x');
//     next('y');
// });

// value$.subscribe((value) => {
//     console.log(value); // x then y
// });
