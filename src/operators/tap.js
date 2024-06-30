import { createObservable } from "../observables/createObservable";

export const tap = (cb) => (source$) => {
    return createObservable((next, error, complete) => {
        const unsubscribe = source$.subscribe((value) => {
            cb(value);
            next(value);
        }, error, complete);

        return unsubscribe;
    });
};

export const terseTap = (cb) => map(v => { cb(); return v; });
