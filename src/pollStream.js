// import { fromPromise } from "./observables/fromPromise.js";
// import { timer } from "./observables/timer.js";
// import { mergeMap } from "./operators/mergeMap.js";

const { from, timer } = window.rxjs;
const { mergeMap } = window.rxjs.operators;

const fromPromise = (promiseGetter) => from(promiseGetter());

export const createPollStream = (path, interval = 1000) =>
    timer(0, interval).pipe(
        mergeMap(() => fromPromise(() => fetch(path))),
        mergeMap((response) => fromPromise(() => response.json())),
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
