import { createPipeable } from "./createPipeable.js";

export const map = (cb) => (source$) => {
    return createPipeable((next, ...rest) => {
        const unsubscribe = source$.subscribe((value) => {
            next(cb(value));
        }, ...rest);

        return unsubscribe;
    });
};
