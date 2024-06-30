import { noop } from "../functional.js";
import { createPipeable } from "./createPipeable.js";

export const concatAll = () => (source$) => {
    return createPipeable((...subscriber) => {
        return internals(source$, subscriber)
    });
}

// const getNext = destination => destination[0];
// const getError = destination => destination[1];
// const getComplete = destination => destination[2];

// const operate = ({
//     destination,
//     next,
//     error,
//     complete,
//     finalize,
// }) => {
//     return [
//         (value) => getNext(destination)(value)
//     ];
// };



const operate = (destination, ...override) => {
    const [destinationNext, destinationError = noop, destinationComplete = noop] = destination;
    const [overrideNext, overrideError, overrideComplete] = override;

    const next = overrideNext ? (value) => {
        overrideNext(value);
    } : destinationNext;
    const error = overrideError ? (e) => {
        overrideError(e);
    } : destinationError;
    const complete = overrideComplete ? () => {
        overrideComplete();
    } : destinationComplete;

    return [
        next,
        error,
        complete,
    ];
};

const internals = (source$, destination) => {
    // Buffered values, in the event of going over our concurrency limit
    const buffer = [];
    // The number of active inner subscriptions.
    let active = 0;
    // Whether or not the outer source has completed.
    let isComplete = false;

    const concurrent = 1;

    const [next, error, complete] = destination;

    /**
     * Checks to see if we can complete our result or not.
     */
    const checkComplete = () => {
        // If the outer has completed, and nothing is left in the buffer,
        // and we don't have any active inner subscriptions, then we can
        // Emit the state and complete.
        if (isComplete && !buffer.length && !active) {
            complete();
        }
    };

    // If we're under our concurrency limit, just start the inner subscription, otherwise buffer and wait.
    const outerNext = (value$) => (active < concurrent ? doInnerSub(value$) : buffer.push(value$));

    const doInnerSub = (value$) => {
        // Increment the number of active subscriptions so we can track it
        // against our concurrency limit later.
        active++;

        // A flag used to show that the inner observable completed.
        // This is checked during finalization to see if we should
        // move to the next item in the buffer, if there is on.
        let innerComplete = false;

        // Start our inner subscription.
        value$.subscribe(
            ...operate(
                destination,
                (innerValue) => {
                    next(innerValue);
                },
                undefined,
                () => {
                    innerComplete = true;
                    // During finalization, if the inner completed (it wasn't errored or
                    // cancelled), then we want to try the next item in the buffer if
                    // there is one.
                    if (innerComplete) {
                        // We have to wrap this in a try/catch because it happens during
                        // finalization, possibly asynchronously, and we want to pass
                        // any errors that happen (like in a projection function) to
                        // the outer Subscriber.
                        try {
                            // INNER SOURCE COMPLETE
                            // Decrement the active count to ensure that the next time
                            // we try to call `doInnerSub`, the number is accurate.
                            active--;
                            // If we have more values in the buffer, try to process those
                            // Note that this call will increment `active` ahead of the
                            // next conditional, if there were any more inner subscriptions
                            // to start.
                            while (buffer.length && active < concurrent) {
                                doInnerSub(buffer.shift());
                            }
                            // Check to see if we can complete, and complete if so.
                            checkComplete();
                        } catch (err) {
                            error(err);
                        }
                    }
                },
            )
        );
    };

    const subscriber = operate(
        destination,
        outerNext,
        undefined,
        () => {
            // Outer completed, make a note of it, and check to see if we can complete everything.
            isComplete = true;
            checkComplete();
        }
    );

    // Subscribe to our source observable.
    const cleanup = source$.subscribe(
        ...subscriber
    );

    return cleanup;
}
// export const concatAll = () => (source$) => {
//     return createPipeable((...destination) => {
//         const [next, error, complete] = destination;

//         let cleanups = [];

//         // let completeCounter = 0;

//         const unsubscribe = source$.subscribe(
//             (child$) => {
//                 // Use a subject to track cleanups
//                 const cleanup = child$.subscribe(
//                     (value) => next(value),
//                     (e) => error(e),
//                     () => {

//                         // TODO: We're gonna skip the complete behavior for now
//                         // completeCounter = completeCounter - 1;
//                         // console.log('complete!')
//                         // if (completeCounter === 0) {
//                         //     complete();
//                         // }
//                     },
//                 );
//                 // completeCounter += 1;
//                 cleanups.push(cleanup);
//             },
//             error,
//             complete,
//         );

//         return () => {
//             unsubscribe();
//             cleanups.forEach(cleanup => cleanup());
//         };
//     });
// };

