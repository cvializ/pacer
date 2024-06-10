import { map } from './map.js';

export const wrapWithKey = (key) => map(value => ({ [key]: value }));
