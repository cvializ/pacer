import { createObservable } from "../observables/createObservable";
import { withErrorAndCompleteSemantics } from "./withErrorAndCompleteSemantics";
import { withMultipleSubscribers } from "./withMultipleSubscribers";

export const createSubject = withErrorAndCompleteSemantics(withMultipleSubscribers(createObservable));
