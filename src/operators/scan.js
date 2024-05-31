import { createPipeable } from "./createPipeable.js";

export const scan = (cb, seed) => source$ => {
    return createPipeable((next, ...rest) => {
        let accumulator = seed;

        const unsubscribe = source$.subscribe((value) => {
            accumulator = cb(accumulator, value);
            next(accumulator);
        }, ...rest);

        return unsubscribe;
    });
};
