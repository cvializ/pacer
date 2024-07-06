import { bufferQueue } from "./bufferQueue.js";

export const pairwise = () => (source$) => {
    return source$.pipe(bufferQueue(2));
}
