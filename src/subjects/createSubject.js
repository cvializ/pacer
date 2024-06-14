import { createObservable } from "../observables/createObservable";
import { withMultipleSubscribers } from "./withMultipleSubscribers";

export const createSubject = withMultipleSubscribers(createObservable);
