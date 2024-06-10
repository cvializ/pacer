import { filter } from "../operators/filter.js";
import { map } from "../operators/map.js";
import { pick } from "../operators/pick.js";
import { scan } from "../operators/scan.js";
import { withPipe } from "../operators/withPipe.js";
import { wrapWithKey } from "../operators/wrapWithKey.js";
import { createUnity } from "../unities/createUnity.js";
import { merge } from "./merge.js";
import { withSubscribe } from "./withSubscribe.js";

const createPipeable = withPipe(withSubscribe(createUnity));

export const withUnsubscribe = (create) => (subscriber) => {
    let unsubscribe;
    const unsubscribe$ = createPipeable((u) => {
        unsubscribe = () => u(true);

        return unsubscribe;
    });

    const observable$ = create((next) => {
        const cleanup = subscriber(next) || noop;

        return () => {
            unsubscribe();
            cleanup();
        };
    });

    const tap = (cb) => map (value => {
        cb(value);
        return value;
    });

    return merge(
        unsubscribe$.pipe(
            tap(v => {
                console.log(`UNSUB: ${v}`);
            }),
            wrapWithKey('unsubscribe')),
        observable$.pipe(
            tap(v => {
                console.log(`VALUE: ${v}`);
            }),
            wrapWithKey('value')),
    ).pipe(
        scan((acc, d) => ({ ...acc, ...d }), {}),
        filter(({ unsubscribe }) => !unsubscribe),
        pick('value'),
        tap(v => {
            console.log(`WOAH: ${v}`);
        }),
    );
};
