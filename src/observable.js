import { noop } from './functional.js';

export const createObservable = (subscriber) => {

    const subscribe = (onNext = noop, onError = noop, onComplete = noop) => {
        try {
            const result = subscriber(onNext, onError, onComplete);
            return result;
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
