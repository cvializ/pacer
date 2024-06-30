import { map } from "./map.js";

export const pick = (key) => map(value => value[key]);
