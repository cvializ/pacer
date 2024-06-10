import { createPipeable } from "./createPipeable.js";

export const filter = (condition) => source$ => {
    return createPipeable((next, ...rest) => {
        const unsubscribe = source$.subscribe((value) => {
            if (condition(value)) {
                next(value);
            }
        }, ...rest);

        return unsubscribe;
    });
};
