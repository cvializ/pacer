import { fromPromise } from "./observables/fromPromise.js";
import { timer } from "./observables/timer.js";
import { map } from "./operators/map.js";
import { mergeAll } from "./operators/mergeAll.js";


export const createPollStream = (path, interval = 1000) =>
    timer(interval).pipe(
        map(() => fromPromise(() => fetch(path))),
        mergeAll(),
        map((response) => fromPromise(() => response.json())),
        mergeAll(),
    );

// export const createPollStream = (path) => {
//     const stream$ = createSubject();
//     const { next, error } = stream$;

//     const fetchLoop = () => {
//         window.fetch(path)
//             .then(response => response.json())
//             .then(json => next(json))
//             .catch(e => {
//                 error(e);
//             })
//             .then(() => {
//                 setTimeout(fetchLoop, 100);
//             });
//     }

//     setTimeout(fetchLoop, 100);

//     return stream$;
// };
