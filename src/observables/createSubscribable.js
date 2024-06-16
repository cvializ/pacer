import { createUnity } from "../unities/createUnity.js";
import { withSubscribe } from "./withSubscribe.js";

export const createSubscribable = withSubscribe(createUnity);
