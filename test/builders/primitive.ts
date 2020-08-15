import { Chance } from 'chance';

export const aRandomPrimitive = () =>
  Chance().pickone([Chance().string(), Chance().integer(), Chance().bool()]);
