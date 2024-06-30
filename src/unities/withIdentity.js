// It's a one-liner : ) )
export const terseWithIdentity = create => (...args) => ({ ...create(...args) });

export const withIdentity = (create) => (...args) => {
    const unity = create(...args);

    return {
        ...unity
    };
};

export const withUnity = withIdentity;
