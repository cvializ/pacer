
/**
 * As a reminder, this is the signature of createObservable
 */
// const createObservable = (subscriber) => {
//     const subscribe = (onNext, ...rest) => {
//         return subscriber(onNext, ...rest);
//     };

//     return {
//         subscribe,
//     };
// };

/** The most fundamental higher-order Observable */
const terseWithIdentity = create => subscriber => ({ ...create(subscriber) });

/** The most fundamental higher-order Observable */
export const withIdentity = create => subscriber => {
    const observable$ = create(subscriber);
    return {
        ...observable$,
    };
}

export const withSubscribe = create => subscriber => {
    const observable$ = create(subscriber);
    const subscribe = (onNext, ...rest) => {
        const cleanup = observable$.subscribe(onNext, ...rest);
        return cleanup;
    };

    return {
        ...observable$,
        subscribe,
    };
}

const withThreeObservable = subscriber => {
    const subscribe = (onNext, onError, onComplete) => {
        const cleanup = subscriber(onNext, onError, onComplete);
        return cleanup;
    };

    return {
        subscribe,
    };
};
