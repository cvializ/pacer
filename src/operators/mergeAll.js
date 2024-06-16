import { createPipeable } from "./createPipeable.js";

export const mergeAll = () => (source$) => {
    return createPipeable((next, error, complete) => {
        let cleanups = [];

        // let completeCounter = 0;

        const unsubscribe = source$.subscribe(
            (child$) => {
                // Use a subject to track cleanups
                const cleanup = child$.subscribe(
                    (value) => next(value),
                    (e) => error(e),
                    () => {
                        // TODO: We're gonna skip the complete behavior for now
                        // completeCounter = completeCounter - 1;
                        // console.log('complete!')
                        // if (completeCounter === 0) {
                        //     complete();
                        // }
                    },
                );
                // completeCounter += 1;
                cleanups.push(cleanup);
            },
            error,
            complete,
        );

        return () => {
            unsubscribe();
            cleanups.forEach(cleanup => cleanup());
        };
    });
};
