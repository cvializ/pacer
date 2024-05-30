
/**
 * Single event single subscriber observables.
 */

import { noop } from "./functional.js";

export const withPipe = (create) => subscriber => {
    const pipe = (...operators) => (
        operators.reduce((
            observable$,
            operator
        ) => operator(observable$), observable$)
    );

    const observable$ = create(subscriber);

    return {
        ...observable$,
        pipe,
    };
};

const createObservable = withPipe((subscriber) => {
    const subscribe = (onNext) => {
        return subscriber(onNext);
    };

    return {
        subscribe,
    };
});

const merge = (...sources) => {
    return createObservable((next) => {
        sources.forEach(source$ => source$.subscribe((value) => {
            next(value);
        }));

        return noop;
    });
};

const filter = (condition) => source$ => {
    return createObservable((next) => {
        source$.subscribe((value) => {
            if (condition(value)) {
                next(value);
            }
        });

        return noop;
    });
};

const scan = (cb, seed) => source$ => {
    return createObservable((next) => {
        let accumulator = seed;

        source$.subscribe((value) => {
            accumulator = cb(accumulator, value);
            next(accumulator);
        });

        return noop;
    });
};

const map = (cb) => (source$) => {
    return createObservable((next) => {
        source$.subscribe((value) => {
            next(cb(value));
        });

        return noop;
    });
};

const pick = (key) => map(value => value[key]);

const wrapWithKey = (key) => map(value => ({ [key]: value }));

const withUnsubscribe = (create) => (subscriber) => {
    let unsubscribe;
    const unsubscribe$ = createObservable((u) => {
        unsubscribe = () => u(true);
    });

    const observable$ = create((next) => {
        const cleanup = subscriber(next);

        return () => {
            unsubscribe();
            cleanup();
        };
    });

    return merge(
        unsubscribe$.pipe(wrapWithKey('unsubscribe')),
        observable$.pipe(wrapWithKey('value')),
    ).pipe(
        filter(({ unsubscribe }) => !unsubscribe),
        pick('value'),
    );
};

export const createSingleEventSingleSubscriberObservable =
    withUnsubscribe(
        createObservable);

// const value$ = createSingleEventObservable((next) => {
//     next('x');
//     next('y');
// });

// value$.subscribe((value) => {
//     console.log(value); // x then y
// });
