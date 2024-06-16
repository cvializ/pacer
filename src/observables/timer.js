import { createObservable } from "./createObservable.js";

export const timer = (repeat) => {
    return createObservable((next) => {
        let i = 0;
        let timeoutId;

        const loop = () => {
            i += 1;
            next(repeat * i);
            timeoutId = setTimeout(loop, repeat);
        }
        timeoutId = setTimeout(loop, repeat);

        return () => {
            clearTimeout(timeoutId);
        };
    });
};
