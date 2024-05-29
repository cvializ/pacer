import { noop } from './functional.js';

export const createObservable = (subscriber) => {

    const subscribe = (onNext = noop, onError = noop, onComplete = noop) => {
        try {
            const result = subscriber(onNext, onError, onComplete);
            return result || noop;
        } catch (e) {
            onError(e);
        }
    };

    const self$ = {
        subscribe,
        pipe: (...operators) => (
            operators.reduce((
                observable$,
                operator
            ) => operator(observable$), self$)
        ),
    };

    return self$;
};

export const createSubject = () => {
    const subscribers = [];

    const next = (value) => {
        subscribers.forEach(subscriber => subscriber.next(value));
    }

    const error = (e) => {
        subscribers.forEach(subscriber => subscriber.error(e));
    }

    const complete = () => {
        subscribers.forEach(subscriber => subscriber.complete());
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
