import { createObservable } from "./createObservable";

export const of = (scalar) => {
    return createObservable((next, error, complete) => {
        next(scalar);
        complete();
    });
};
