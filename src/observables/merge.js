import { withPipe } from "../operators/withPipe.js";
import { createUnity } from "../unities/createUnity.js";
import { withSubscribe } from "./withSubscribe.js";

const createPipeable = withPipe(withSubscribe(createUnity));

export const merge = (...sources) => {
    return createPipeable((next, ...args) => {
        const cleanups = sources.map(source$ => {
            const cleanup = source$.subscribe((value) => {
                next(value);
            }, ...args);

            return cleanup;
        });

        return () => {
            cleanups.map(cleanup => cleanup());
        };
    });
};
