
// import { test, mock } from "node:test";
// import assert from "node:assert";
// import { withPipe } from "./withPipe.js";
// import { of } from "../observables/of.js";
// import { identity } from "../functional.js";
// import { merge } from "../observables/merge.js";
// import { wrapWithKey } from "./wrapWithKey.js";
// import { scan } from "./scan.js";

// // const mergeScan = (a$, b$) => {
// //     return merge(
// //         a$.pipe(
// //             wrapWithKey('a')),
// //         b$.pipe(
// //             wrapWithKey('b')),
// //     ).pipe(
// //         scan((acc, d) => ({ ...acc, ...d }), {}),
// //         filter()
// //     );
// // }

// // const forkJoin = (...observables) => {
// //     const inner$ = fromArray(observables)
// // }

// import { createPipeable } from "./createPipeable.js";
// import { fromArray } from "../observables/fromArray.js";

// export const forkJoin = (...observables) => {
//     return createPipeable((next, error, complete) => {
//         let cleanups = [];

//         // let completeCounter = 0;
//         const source$ = fromArray(observables);

//         const unsubscribe = source$.subscribe(
//             (child$) => {
//                 let value;
//                 // Use a subject to track cleanups
//                 const cleanup = child$.subscribe(
//                     (v) => value = v,
//                     (e) => error(e),
//                     () => {
//                         next(value);
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




// test("does its thing", () => {
//     const a$ = of(1);
//     const b$ = of(2);

//     const spy = mock.fn(identity);
//     const cleanup = forkJoin(a$, b$).subscribe(spy);

//     assert.deepEqual(spy.mock.calls[0].arguments[0], { a: 1 });
//     assert.deepEqual(spy.mock.calls[1].arguments[0], { a: 1, b: 2});
//     // assert.strictEqual(spy.mock.calls[2].arguments[0], 3);
//     assert.strictEqual(spy.mock.callCount(), 2);
// });
