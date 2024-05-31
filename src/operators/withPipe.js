import { withIdentity } from "../observables/higher-order";

export const terseWithPipe = withBehavior((observable$) => ({
    pipe: (...operators) => (
        operators.reduce((
            observable$,
            operator
        ) => operator(observable$), observable$)
    )
}));

export const withPipe = create => subscriber => {
    const pipe = (...operators) => (
        operators.reduce((
            observable$,
            operator
        ) => operator(observable$), observable$)
    );

    const observable$ = create(subscriber);
    const subscribe = (onNext, ...rest) => {
        const cleanup = observable.subscribe(onNext, ...rest);
        return cleanup;
    };

    return {
        ...observable$,
        subscribe,
        pipe,
    };
};
