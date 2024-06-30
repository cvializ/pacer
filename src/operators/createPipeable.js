import { createUnity } from "../unities/createUnity.js";
import { withSubscribe } from "../observables/withSubscribe.js";
import { withPipe } from "./withPipe.js";

export const createPipeable = withPipe(withSubscribe(createUnity));
