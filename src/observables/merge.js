import { noop } from "../functional.js";
import { bufferQueue } from "../operators/bufferQueue.js";
import { withPipe } from "../operators/withPipe.js";
import { createUnity } from "../unities/createUnity.js";
import { withSubscribe } from "./withSubscribe.js";

const createPipeable = withPipe(withSubscribe(createUnity));

// This is more of an exploration of eliminating arrays
// const merge = (sources$) => {
//     let nextUnsubscribe;
//     const unsubscribe$ = createPipeable(u => {
//         nextUnsubscribe = u;
//     }).pipe(bufferQueue(Infinity));

//     return createPipeable(next => {
//         sources$.subscribe(source$ => {
//             const u = source$.subscribe(value => next(value));
//             nextUnsubscribe(u);
//         });

//         return () => {
//             unsubscribe$.subscribe(unsubscribe => unsubscribe());
//         };
//     });
// };


export const merge = (...sources) => {
    // let nextUnsubscribe;
    // const unsubscribe$ = createPipeable(u => {
    //     nextUnsubscribe = u;
    //     console.log('HEYHEY')
    // }).pipe(bufferQueue(sources.length));

    return createPipeable((next, ...args) => {
        const unsubscribes = sources.map(source$ => {
            const unsubscribe = source$.subscribe((value) => {
                next(value);
            }, ...args);

            return unsubscribe;
            // console.log('didja', nextUnsubscribe);
            // nextUnsubscribe(unsubscribe);
        });

        return () => {
            // console.log('WE UNSUBBIN');
            // unsubscribe$.subscribe(unsubscribe => unsubscribe());
            unsubscribes.map(u => u());
        };
    });
};
