// As a refresher...
//
// export const createObservable = (subscriber) => {
//     const subscribe = (onNext, ...rest) => {
//         return subscriber(onNext, ...rest);
//     };

import { noop } from "../functional.js";

//     return {
//         subscribe,
//     };
// };

const terseWithSubscribe = create => subscriber => {
    const observable$ = create(subscriber);
    return {
        ...observable$,
        subscribe: (onNext, ...rest) => observable$.subscribe(onNext, ...rest)
    };
}

// this probably isn't wanted
export const withInnerSubscribe = create => subscriber => {
    const subscribe = (onNext, ...rest) => {
        const cleanup = create(subscriber).subscribe(onNext, ...rest);
        return cleanup;
    };

    return {
        ...observable$,
        subscribe,
    };
}

const withSubscribeBehavior = (anyArgs) => withBehavior((unity) => {
    return (create) => (...args) => {
        const unity = create(...args);

        return {
            ...unity,
            ...behavior(unity),
        };
    };
})

export const withSubscribe = create => (subscriber, ...rest) => {
    const unity = create(subscriber, ...rest);

    const subscribe = (onNext) => {
        const cleanup = subscriber(onNext);
        return cleanup;
    };

    return {
        ...unity,
        subscribe,
    };
}


const withThreeSubscribe = subscriber => {
    const subscribe = (onNext, onError, onComplete) => {
        const cleanup = subscriber(onNext, onError, onComplete);
        return cleanup;
    };

    return {
        subscribe,
    };
};
