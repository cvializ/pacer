import { createObservable } from "../createObservable";

const terseIdentity = () => source$ => createObservable((...next) => source$.subscribe(...next));

const nIdentity = () => (source$) => {
    return createObservable((next, ...args) => {
        const unsubscribe = source$.subscribe((value) => {
            next(value);
        }, ...args);

        return () => unsubscribe();
    });
};

const threeIdentity = () => (source$) => {
    return createObservable((next, error, complete) => {
        const unsubscribe = source$.subscribe((value) => {
            next(value);
        }, error, complete);

        return () => unsubscribe();
    });
};

export const identity = threeIdentity; // TODO: try the others



