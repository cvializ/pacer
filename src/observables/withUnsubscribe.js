import { merge } from "../observable.js";
import { createPipeable } from "../operators/createPipeable.js";


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

    return merge(
        unsubscribe$.pipe(wrapWithKey('unsubscribe')),
        observable$.pipe(wrapWithKey('value')),
    ).pipe(
        scan((acc, d) => ({ ...acc, ...d }), {}),
        filter(({ unsubscribe }) => !unsubscribe),
        pick('value'),
    );
};
