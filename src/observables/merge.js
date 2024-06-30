import { createPipeable } from "../operators/createPipeable.js";

export const merge = (...sources) => {
    return createPipeable((next, ...args) => {
        const cleanups = sources.map(source$ => {
            const cleanup = source$.subscribe((value) => {
                next(value);
            }, ...args);

            return cleanup;
        });

        return () => {
            cleanups.map(cleanup => cleanup());
        };
    });
};
