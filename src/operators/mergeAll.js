import { createPipeable } from "./createPipeable.js";

export const mergeAll = () => (source$) => {
    return createPipeable((next, error, complete) => {
        const unsubscribe = source$.subscribe((child$) => {
            // Use a subject to track cleanups
            const cleanup = child$.subscribe(
                value => next(value),
                e => error(e),
                () => complete(),
            );
        }, error, complete);

        return unsubscribe;
    });
};
