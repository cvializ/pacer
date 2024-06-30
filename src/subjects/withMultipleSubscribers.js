import { createObservable } from "../observables/createObservable.js";
import { createPipeable } from "../operators/createPipeable.js";


// let next, error, complete;
// const observable$ = createObservable(n => {
//     next = n;
// }, e => { error = e; }, c => { complete = c; })

// export const withMultipleSubscribers = create => () =>

export const withMultipleSubscribers = create => (...args) => {
    const subscribers = [];
    // let subscriberLength;

    const stream$ = create((next, ...rest) => {
        const subscriber = [next, ...rest];
        // subscriberLength = subscriber.length;
        subscribers.push(subscriber);
        // nextSubscriber(subscriber);

        return () => {
            const index = subscribers.indexOf(subscriber);
            subscribers.splice(index, 1);
        };
    });

    // const wrappedNext = (value) => {
    //     subscribers.forEach(subscriber => subscriber[0](value));
    //     // next(value);
    // }

    // const error = (e) => {
    //     subscribers.forEach(subscriber => subscriber.error(e));
    // }

    // const complete = () => {
    //     subscribers.forEach(subscriber => subscriber.complete());
    // }

    // How many semantically different parameters can there be besides
    // next, error and complete? wombo.
    const emitters = Array.from({ length: 8 }).map((unusedItem, index) => {
        return value => {
            subscribers.forEach(subscriber => {
                const subscriberFunctions = subscriber[index];
                if (subscriberFunctions) {
                    return subscriberFunctions(value);
                }
            });
        };
    });

    return {
        ...stream$,
        emitters,
        next: emitters[0],
    };
};
