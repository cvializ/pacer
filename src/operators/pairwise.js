import { bufferQueue } from "./bufferQueue";

export const pairwise = () => (source$) => {
    return source$.pipe(bufferQueue(2));
}
