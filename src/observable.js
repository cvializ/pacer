import { noop } from './functional.js';

export const createObservable = (subscriber) => {

    const subscribe = (onNext = noop, onError = noop, onComplete = noop) => {
        return subscriber(onNext, onError, onComplete);
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
    return createObservable((next) => {
        next(scalar);
    });
};

export const merge = (...sources) => {
    return createObservable((next, error, complete) => {
        sources.forEach(source$ => source$.subscribe((value) => {
            next(value);
        }, error, complete));

        return noop;
    });
};
