import { noop } from "../functional.js";
import { createObservable } from "./createObservable.js";

export const fromArray = array => createObservable((next, error, complete) => {
    array.forEach(value => next(value));

    complete();

    return noop;
});
