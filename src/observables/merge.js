import { bufferQueue } from "../operators/bufferQueue.js";
import { withPipe } from "../operators/withPipe.js";
import { createUnity } from "../unities/createUnity.js";
import { withSubscribe } from "./withSubscribe.js";

const createPipeable = withPipe(withSubscribe(createUnity));

const merge = (sources$) => {
    let nextUnsubscribe;
    const unsubscribe$ = createPipeable(u => {
        nextUnsubscribe = u;
    }).pipe(bufferQueue(Infinity));

    return createPipeable(next => {
        sources$.subscribe(source$ => {
            const u = source$.subscribe(value => next(value));
            nextUnsubscribe(u);
        });

        return () => {
            unsubscribe$.subscribe(unsubscribe => unsubscribe());
        };
    });
};

const withUnsubscribe = withBehavior((subscribable, subscriber) => {
    let nextUnsubscribe;
    const unsubscribe$ = createPipeable(u => {
        nextUnsubscribe = u;
    }).pipe(bufferQueue(Infinity));

    return {
        subscribe:
    }
});
