
import { noop } from "../functional.js";
import { createUnsubscribable } from "./createUnsubscribable.js";


export const withErrorAndComplete = create => subscriber => {
    const subscribable$ = create(subscriber);

    const subscribe = (onNext = noop, onError = noop, onComplete = noop) => {
        let next;
        const next$ = createUnsubscribable((n) => {
            next = n;
            return noop;
        });
        const unsubscribeNext = next$.subscribe((value) => onNext(value));

        let error;
        const error$ = createUnsubscribable((e) => {
            error = e;
            return noop;
        });
        const unsubscribeError = error$.subscribe((error) => onError(error));

        let complete;
        const complete$ = createUnsubscribable((c) => {
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
            setTimeout(() => { throw e }, 1);
        }
    };

    return {
        ...subscribable$,
        subscribe,
    };
};
