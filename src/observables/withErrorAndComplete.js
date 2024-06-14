
import { noop } from "../functional.js";
import { map } from "../operators/map.js";
import { withPipe } from "../operators/withPipe.js";
import { createUnity } from "../unities/createUnity.js";
import { withSubscribe } from "./withSubscribe.js";
import { withUnsubscribe } from "./withUnsubscribe.js";

const createSubscribableWithUnsubscribe = withUnsubscribe(withPipe(withSubscribe(createUnity)));

const tap = (cb) => map(v => { cb(); return v; });

export const withErrorAndComplete = create => subscriber => {
    const subscribable$ = create(subscriber);

    const subscribe = (onNext = noop, onError = noop, onComplete = noop) => {
        let next;
        const next$ = createSubscribableWithUnsubscribe((n) => {
            next = n;
            return noop;
        });
        const unsubscribeNext = next$.pipe(
            tap(value => console.log('NEXT:', value)),
        ).subscribe((value) => onNext(value));

        let error;
        const error$ = createSubscribableWithUnsubscribe((e) => {
            error = e;
            return noop;
        });
        const unsubscribeError = error$.subscribe((error) => onError(error));

        let complete;
        const complete$ = createSubscribableWithUnsubscribe((c) => {
            complete = c;
            return noop;
        });
        const unsubscribeComplete = complete$.subscribe(() => onComplete());

        const wrappedOnNext = (value) => {
            next(value);
        };
        const wrappedOnError = (e) => {
            unsubscribeNext();
            unsubscribeComplete();
            error(e);
            unsubscribeError();
        };
        const wrappedOnComplete = () => {
            unsubscribeNext()
            unsubscribeError();
            complete();
            unsubscribeComplete();
        };

        try {
            const cleanup = subscribable$.subscribe(
                wrappedOnNext,
                wrappedOnError,
                wrappedOnComplete
            );

            return () => {
                unsubscribeNext();
                unsubscribeError();
                unsubscribeComplete();
                cleanup();
            };
        } catch (e) {
            unsubscribeNext();
            unsubscribeComplete();
            wrappedOnError(e);
            unsubscribeError();
        }
    };

    return {
        ...subscribable$,
        subscribe,
    };
};
