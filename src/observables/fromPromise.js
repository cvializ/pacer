import { noop } from "../functional.js";
import { createObservable } from "./createObservable.js";

export const fromPromise = promiseGetter => createObservable((next, error, complete) => {
    promiseGetter().then(value => next(value), e => error(e)).finally(() => complete());
    return noop;
});
