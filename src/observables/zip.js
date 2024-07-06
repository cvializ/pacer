import { createObservable } from "./createObservable.js";

export const zip = (...observables) => {
    return createObservable((next, error, complete) => {
        let buffers = Array.from({length: observables.length});
        const completes = Array.from({ length: observables.length });
        const cleanups = [];

        for (let index = 0; index < observables.length; index++) {
            const observable$ = observables[index];

            const cleanup = observable$.subscribe(value => {
                buffers[index] = [...(buffers[index] || []), value];

                if (buffers.every(buffer => buffer && buffer[0])) {
                    const result = buffers.map(buffer => buffer[0]);
                    buffers = buffers.map(buffer => {
                        const [first, ...rest] = buffer;
                        return rest;
                    });
                    next(result);
                }
            }, error, () => {
                completes[index] = true;
                if (completes.every(Boolean)) {
                    complete();
                }
            });

            cleanups.push(cleanup);
        }

        return () => {
            cleanups.forEach(cleanup => cleanup());
        };
    });
};
