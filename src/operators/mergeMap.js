import { map } from "./map.js";
import { mergeAll } from "./mergeAll.js";

export const mergeMap = (cb) => (source$) => {
    return source$.pipe(
        map(cb),
        mergeAll(),
    );
};
