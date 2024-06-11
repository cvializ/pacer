import { createObservable } from "../observables/createObservable.js";
import { createPipeable } from "../operators/createPipeable.js";


// let next, error, complete;
// const observable$ = createObservable(n => {
//     next = n;
// }, e => { error = e; }, c => { complete = c; })

export const createSubject = () => {
    // const subscribers = [];
    let nextSubscriber;
    const subscriber$ = createPipeable(n => {
        nextSubscriber = n;
    });

    // TODO this will break
    let next;
    const next$ = createPipeable(n => {
        console.log('OK')
        next = n;
    });

    // 1. use a buffer operator to build a list?
    // 2. create a next stream and a subscriber stream and merge scan em <------ this is it
    // 3. ???
    const cleanup = subscriber$.subscribe(subscriber => {
        console.log('WOW')
        next$.subscribe(value => {
            subscriber.next(value);
        });
    });

    const stream$ = createObservable((next, error, complete) => {
        const subscriber = {
            next,
            error,
            complete,
        };
        // subscribers.push(subscriber);
        nextSubscriber(subscriber);

        return () => {
            // const index = subscribers.indexOf(subscriber);
            // subscribers.splice(index, 1);

        };
    });

    const wrappedNext = (value) => {
        next(value);
    }

    const error = (e) => {
        subscribers.forEach(subscriber => subscriber.error(e));
    }

    const complete = () => {
        subscribers.forEach(subscriber => subscriber.complete());
    }

    return {
        stream$,
        next: wrappedNext,
        error,
        complete,
    };
}
