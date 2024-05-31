import { createPipeable } from "./createPipeable.js";

const terseIdentity = () => source$ => createPipeable((...next) => source$.subscribe(...next));

const nIdentity = () => (source$) => {
    return createPipeable((next, ...args) => {
        const unsubscribe = source$.subscribe((value) => {
            next(value);
        }, ...args);

        return unsubscribe;
    });
};

const threeIdentity = () => (source$) => {
    return createPipeable((next, error, complete) => {
        const unsubscribe = source$.subscribe((value) => {
            next(value);
        }, error, complete);

        return unsubscribe;
    });
};

export const identity = nIdentity; // TODO: try the others
