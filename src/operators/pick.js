import { map } from "./map";

export const pick = (key) => map(value => value[key]);
