import { noop } from "../functional.js";
import { filter } from "../operators/filter.js";
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

    const observable$ = create((next, ...rest) => {
        const cleanup = subscriber(next, ...rest) || noop;

        return () => {
            unsubscribe();
            cleanup();
        };
    });

    return merge(
        unsubscribe$.pipe(
            wrapWithKey('unsubscribe')),
        observable$.pipe(
            wrapWithKey('value')),
    ).pipe(
        scan((acc, d) => ({ ...acc, ...d }), {}),
        filter(({ unsubscribe }) => !unsubscribe),
        pick('value'),
    );
};
