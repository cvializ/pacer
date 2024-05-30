import { noop } from './functional.js';
import { createSingleEventSingleSubscriberObservable as createSingleObservable, withPipe } from './single.js';


export const createObservable = withPipe((subscriber) => {

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
            const cleanup = subscriber(
                wrappedOnNext,
                wrappedOnError,
                wrappedOnComplete
            );

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
});

export const createSubject = () => {
    const subscribers = [];

    const next = (value) => {
        subscribers.forEach(subscriber => subscriber.next(value));
    }

    const error = (e) => {
        subscribers.forEach(subscriber => {
            subscriber.error(e)
            subscriber.next = noop;
        });
    }

    const complete = () => {
        subscribers.forEach(subscriber => subscriber.complete());
        subscriber.next = noop;
    }

    const stream$ = createObservable((next, error, complete) => {
        const subscriber = {
            next,
            error,
            complete,
        };
        subscribers.push(subscriber);

        return () => {
            const index = subscribers.indexOf(subscriber);
            subscribers.splice(index, 1);
        };
    });

    return {
        stream$,
        next,
        error,
        complete,
    };
}

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
