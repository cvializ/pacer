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

import { withBehavior } from "../unities/withBehavior.js";


export const terseWithSubscribe = withBehavior((subscriber) => ({
    subscribe: (onNext, ...rest) => subscriber(onNext, ...rest)
}));

export const withSubscribe = withBehavior((subscriber) => {
    const subscribe = (onNext, ...rest) => {
        const cleanup = subscriber(onNext, ...rest);
        return cleanup;
    };

    return { subscribe };
});

export const withThreeSubscribe = withBehavior(subscriber => {
    const subscribe = (onNext, onError, onComplete) => {
        const cleanup = subscriber(onNext, onError, onComplete);
        return cleanup;
    };

    return { subscribe };
});
