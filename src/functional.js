export const identity = x => x;

export const noop = () => { };

export const compose = (...fns) =>
    fns.reduce(
        (composed, fn) =>
            (...args) =>
                composed(fn(...args)),
    );
