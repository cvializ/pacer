import { createObservable } from "../observables/createObservable.js";
import { withErrorAndCompleteSemantics } from "./withErrorAndCompleteSemantics.js";
import { withMultipleSubscribers } from "./withMultipleSubscribers.js";

export const createSubject = withErrorAndCompleteSemantics(withMultipleSubscribers(createObservable));
