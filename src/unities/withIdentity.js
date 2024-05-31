// It's a one-liner : ) )
export const terseWithUnity = create => (...args) => ({ ...create(...args) });

export const withIdentity = (create) => (...args) => {
    const unity = create(...args);

    return {
        ...unity
    };
};

export const withUnity = withIdentity;
