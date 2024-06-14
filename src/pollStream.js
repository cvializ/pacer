import { noop } from "./functional";
import { createObservable } from "./observables/createObservable";
import { createPipeable } from "./operators/createPipeable";
import { createSubject } from "./subjects/createSubject";

const timer = (repeat) => {
    return createObservable((next) => {
        let i = 0;
        const timeoutId = setTimeout(() => {
            i += 1;
            next(repeat * i);
        }, repeat);

        return () => {
            clearInterval(timeoutId);
        };
    });
};


const mergeAll = () => (source$) => {
    return createPipeable((next, error, complete) => {
        const unsubscribe = source$.subscribe((child$) => {
            // Use a subject to track cleanups
            const cleanup = child$.subscribe(
                value => next(value),
                e => error(e),
                () => complete(),
            );
        }, error, complete);

        return unsubscribe;
    });
};

const fromPromise = promiseGetter => createObservable((next, error, complete) => {
    promiseGetter.then(value => next(value), e => error(e)).finally(() => complete());
    return noop;
});

const createPollStreamTerse = (path) =>
    timer(100).pipe(
        map(() => fromPromise(() => fetch(path))),
        mergeAll(),
        map((response) => response.json()),
        mergeAll(),
    );

export const createPollStream = (path) => {
    const stream$ = createSubject();
    const { next, error } = stream$;

    const fetchLoop = () => {
        window.fetch(path)
            .then(response => response.json())
            .then(json => next(json))
            .catch(e => {
                error(e);
            })
            .then(() => {
                setTimeout(fetchLoop, 100);
            });
    }

    setTimeout(fetchLoop, 100);

    return stream$;
};
