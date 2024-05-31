/**
 * The fundamental unit of side-effects.
 *
 * An Observable instance is an Object with one property, subscribe.
 *
 * Additional behaviors can be added by composing the createObservable function
 * with higher-order Observables.
 *
 * e.g. withPipe to enable piping operators and
 * e.g. withPipeSubject to enable Subjects (todo)
 *
 * This is not used in public-facing APIs as you'll
 * generally want operators etc. for application code.
 */

import { withSubscribe } from "./withSubscribe.js";

const terseCreateObservable = (subscriber) => ({
    subscribe: (...onNext) => subscriber(...onNext)
});

export const createObservable = (subscriber) => {
    const subscribe = (onNext, ...rest) => {
        return subscriber(onNext, ...rest);
    };

    return {
        subscribe,
    };
};


export const createUnityObservable = withSubscribe(createUnity);
