import { createPipeable } from "./createPipeable.js";

export const bufferQueue = (length) => (source$) => {
    return createPipeable((next, ...args) => {
        const buffer = [];

        const cleanup = source$.subscribe((value) => {
            buffer.unshift(value);

            if (buffer.length > length) {
                buffer.pop();
            }

            next(buffer);
        }, ...args);

        return () => {
            buffer.length = 0;
            cleanup();
        }
    });
}
