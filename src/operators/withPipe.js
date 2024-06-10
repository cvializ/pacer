export const withPipe = create => (...args) => {
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
};
