// TODO: last, repeat, zip

import { createObservable } from "../observables/createObservable.js";

export const last = () => source$ => {
    return createObservable((next, error, complete) => {
        let recent = null;

        const unsubscribe = source$.subscribe((value) => {
            recent = value;
        }, error, () => {
            next(recent);
            complete();
        });

        return unsubscribe;
    });
};
