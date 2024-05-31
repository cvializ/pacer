export const withBehavior = behavior => (create) => (...args) => {
    const unity = create(...args);

    return {
        ...unity,
        ...behavior(unity),
    };
};

const withSpecificBehavior = (anyArgs) => withBehavior((unity) => {
    return (create) => (...args) => {
        const unity = create(...args);

        return {
            ...unity,
            ...behavior(unity),
        };
    };
})
