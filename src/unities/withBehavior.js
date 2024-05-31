
export const withBehavior = behavior => create => (...args) => {
    const unity = create(...args);

    return {
        ...unity,
        ...behavior(...args),
    };
};
