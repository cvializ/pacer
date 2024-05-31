import { createPipeable } from "../operators/createPipeable.js";
import { createSubscribable } from "./createSubscribable.js";

export const withErrorAndComplete = create => subscriber => {
    const subscribable = create(subscriber);

    const subscribe = (onNext = noop, onError = noop, onComplete = noop) => {
        let next;
        const next$ = createSubscribable((n) => {
            next = n;
        });
        const unsubscribeNext = next$.subscribe((value) => onNext(value));

        let error;
        const error$ = createSubscribable((e) => {
            error = e;
        });
        const unsubscribeError = error$.subscribe((error) => onError(error));

        let complete;
        const complete$ = createSubscribable((c) => {
            complete = c;
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
            const cleanup = subscribable(
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
        ...subscribable,
        subscribe,
    };
};
