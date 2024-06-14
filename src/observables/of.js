import { createObservable } from "./createObservable.js";

export const of = (scalar) => {
    return createObservable((next, error, complete) => {
        next(scalar);
        complete();
    });
};
