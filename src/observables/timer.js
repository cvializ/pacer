import { createObservable } from "./createObservable.js";

export const timer = (repeat) => {
    return createObservable((next) => {
        let i = 0;
        let timeoutId;

        timeoutId = setInterval(() => {
            i += 1;
            next(repeat * i);
        }, repeat);

        return () => {
            clearInterval(timeoutId);
        };
    });
};
