
export const withBehavior = behavior => create => (...args) => {
    return {
        ...behavior(create, ...args),
    };
};
