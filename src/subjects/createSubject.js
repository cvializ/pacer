import { createPipeable } from "../operators/createPipeable.js";


export const createSubject = () => {
    // const subscribers = [];
    let nextSubscriber;
    const subscriber$ = createPipeable(n => {
        nextSubscriber = n;
    });

    // 1. use a buffer operator to build a list?
    // 2. create a next stream and a subscriber stream and merge scan em <------ this is it
    // 3. ???
    let next;
    const unsubscribe = subscriber$.subscribe(subscriber => {
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

        next('value');

        return () => {
            // const index = subscribers.indexOf(subscriber);
            // subscribers.splice(index, 1);

        };
    });

    // const next = (value) => {
    //     subscribers.forEach(subscriber => subscriber.next(value));
    // }

    // const error = (e) => {
    //     subscribers.forEach(subscriber => subscriber.error(e));
    // }

    // const complete = () => {
    //     subscribers.forEach(subscriber => subscriber.complete());
    // }

    return {
        stream$,
        next,
        error,
        complete,
    };
}
