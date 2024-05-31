import { withBehavior } from "../unities/withBehavior.js";

export const withPipe = withBehavior((create, ...args) => {
    const subscribable = create(...args);

    const pipe = (...operators) => (
        operators.reduce((
            accumulatedSubscribable,
            operator
        ) => operator(accumulatedSubscribable), subscribable)
    );

    return {
        ...subscribable,
        pipe
    };
});
