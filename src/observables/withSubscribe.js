// As a refresher...
//
// export const createObservable = (subscriber) => {
//     const subscribe = (onNext, ...rest) => {
//         return subscriber(onNext, ...rest);
//     };
//     return {
//         subscribe,
//     };
// };

export const terseWithSubscribe = create => subscriber => ({
    ...create(subscriber),
    subscribe: (onNext, ...rest) => subscriber(onNext, ...rest)
});

export const withSubscribe = create => subscriber => {
    const subscribe = (onNext, ...rest) => {
        const cleanup = subscriber(onNext, ...rest);
        return cleanup
    };

    return {
        ...create(subscriber),
        subscribe
    };
};

export const withThreeSubscribe = create => subscriber => {
    const subscribe = (onNext, onError, onComplete) => {
        const cleanup = subscriber(onNext, onError, onComplete);
        return cleanup;
    };

    return {
        ...create(subscriber),
        subscribe
    };
};
