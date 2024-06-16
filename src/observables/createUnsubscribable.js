import { createPipeable } from "../operators/createPipeable.js";
import { withUnsubscribe } from "./withUnsubscribe.js";

export const createUnsubscribable = withUnsubscribe(createPipeable);
