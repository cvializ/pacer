export const withErrorAndCompleteSemantics = (create) => (...args) => {
        const stream$ = create(...args);
        const { emitters } = stream$;
        const [ next, error, complete ] = emitters;

        return {
            ...stream$,
            next,
            error,
            complete,
            emitters,
        };
};
