import { Chance } from 'chance';

export const aRandomPrimitive = () =>
  Chance().pickone([
    Chance().string(),
    Chance().integer(),
    Chance().bool(),
    null,
  ]);

export const aValueThatIs = <T>(
  valueGenerator: () => T,
  { not = undefined } = {}
) => {
  let result;
  while (result === not) {
    result = valueGenerator();
  }
  return result;
};

export const aRandomArray = ({
  length = Chance().integer({ min: 0, max: 10 }),
} = {}) => Chance().n(() => Chance().string(), length);
