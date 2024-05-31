import { noop } from './functional.js';
import { createSingleEventSingleSubscriberObservable as createSingleObservable, withPipe } from './single.js';

const createObservable = (subscriber) => {
    const subscribe = (onNext, ...rest) => {
        return subscriber(onNext, ...rest);
    };

    return {
        subscribe,
    };
};

// const id = () =>
//     (subscriber) => {
//         const subscribe = (onNext) => {
//             return subscriber(onNext);
//         };

//         return {
//             subscribe,
//         };
//     };

const createThreeObservable = (subscriber) => {
    const subscribe = (onNext, onError, onComplete) => {
        const cleanup = subscriber(onNext, onError, onComplete);
        return cleanup;
    };

    return {
        subscribe,
    };
};

const withErrorAndComplete = (create) => (subscriber) => {
    const subscribe = (onNext = noop, onError = noop, onComplete = noop) => {
        let next;
        const next$ = createSingleObservable((n) => {
            next = n;
        });
        const unsubscribeNext = next$.subscribe((value) => onNext(value));

        let error;
        const error$ = createSingleObservable((e) => {
            error = e;
        });
        const unsubscribeError = error$.subscribe((error) => onError(error));

        let complete;
        const complete$ = createSingleObservable((c) => {
            complete = c;
        });
        const unsubscribeComplete = complete$.subscribe(() => onComplete());

        const wrappedOnNext = (value) => {
            next(value);
        };
        const wrappedOnError = (e) => {
            unsubscribeNext();
            unsubscribeComplete();
            error(e);
            unsubscribeError();
        };
        const wrappedOnComplete = () => {
            unsubscribeNext()
            unsubscribeError();
            complete();
            unsubscribeComplete();
        };

        try {
            const cleanup = create(subscriber)(
                wrappedOnNext,
                wrappedOnError,
                wrappedOnComplete
            );
            // const observable$ = create((next) => {
            //     const cleanup = subscriber(next) || noop;

            //     return () => {
            //         unsubscribe();
            //         cleanup();
            //     };
            // });

            return () => {
                unsubscribeNext();
                unsubscribeError();
                unsubscribeComplete();
                cleanup();
            };
        } catch (e) {
            unsubscribeNext();
            unsubscribeComplete();
            wrappedOnError(e);
            unsubscribeError();
        }
    };

    return {
        subscribe,
    };
};

export const createErrorAndCompleteObservable = withErrorAndComplete(createThreeObservable);

export const createSubject = () => {
    // const subscribers = [];
    let nextSubscriber;
    const subscriber$ = createSingleObservable(n => {
        nextSubscriber = n;
    });

    // 1. use a buffer operator to build a list?
    // 2. create a next stream and a subscriber stream and merge scan em <------ this is it
    // 3. ???
    let next;
    subscriber$.subscribe(subscriber => {
        next$.subscribe(inner => {

        });
    });

    const stream$ = createObservable((next, error, complete) => {
        const subscriber = {
            next,
            error,
            complete,
        };
        // subscribers.push(subscriber);
        nextSubscriber(subscriber);

        next('value');

        return () => {
            // const index = subscribers.indexOf(subscriber);
            // subscribers.splice(index, 1);

        };
    });

    const next = (value) => {
        subscribers.forEach(subscriber => subscriber.next(value));
    }

    const error = (e) => {
        subscribers.forEach(subscriber => subscriber.error(e));
    }

    const complete = () => {
        subscribers.forEach(subscriber => subscriber.complete());
    }

    return {
        stream$,
        next,
        error,
        complete,
    };
}

// const { stream$, next, error } = createSubject();

// stream$.subscribe((value) => {
//     if (value === 2) {
//         error('wow');
//         error('cool');
//     }

//     console.log('VALUE X', value);
// }, e => {
//     console.warn(e);
// })

// next(1);
// next(2);
// next(3);

export const of = (scalar) => {
    return createObservable((next, error, complete) => {
        next(scalar);
        complete();
    });
};

export const NEVER = createObservable((next, error, complete) => {});

export const EMPTY = createObservable((next, error, complete) => complete());

export const merge = (...sources) => {
    return createObservable((next, error, complete) => {
        sources.forEach(source$ => source$.subscribe((value) => {
            next(value);
        }, error, complete));

        return noop;
    });
};
