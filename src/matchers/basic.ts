import deepEqual from 'fast-deep-equal';

export const sameAs = <T>(expected: T) => (actual: T) =>
  actual === expected || [
    'Expected values to be strictly equal (===), but they were not',
    expected,
    actual,
  ];

export const equal = <T>(expected: T) => (actual: T) =>
  deepEqual(expected, actual) || [
    'Expected values to be deeply equal, but they were not',
    expected,
    actual,
  ];

export const withLength = (length: number) => (actual: string | unknown[]) => {
  if (typeof actual !== 'string' && !(actual instanceof Array)) {
    return 'The given value is not an array nor a string';
  }

  if (actual.length !== length) {
    return ['The given value had an incorrect length', length, actual.length];
  }

  return true;
};

export const withProperty = (key: string, value?: any) =>
  function (actual) {
    if (typeof actual !== 'object' || !actual) {
      return 'The given value is not an object';
    }

    if (!(key in actual)) {
      return `The object does not contain the key "${key}"`;
    }

    if (typeof value !== 'undefined' && !deepEqual(actual[key], value)) {
      return [
        `The object contains a value other than expected at property "${key}"`,
        value,
        actual[key],
      ];
    }

    return true;
  };

export const between = (min: number, max: number) => (actual: number) => {
  const [actualMin, actualMax] = [min, max].sort((a, b) => a - b);

  if (typeof actual !== 'number') {
    return 'The given value is not a number';
  }

  if (actualMin > actual || actual > actualMax) {
    return `Expected ${actual} to be in range [${actualMin}, ${actualMax}]`;
  }

  return true;
};

export const defined = (actual) =>
  typeof actual !== 'undefined' ||
  `Expected value to be defined, but it wasn't`;

// export const falsy = () => (val) =>
//   Boolean(val) === false || ['expected value to be falsy', false, val];

// export const greaterThan = (min: number) => (val: number) =>
//   val > min || `expected ${val} to be greater than ${min}`;

// export const greaterThanEqual = (min: number) => (val: number) =>
//   val >= min || `expected ${val} to be greater than or equal ${min}`;

// export const lessThan = (max: number) => (val: number) =>
//   val < max || `expected ${val} to be less than ${max}`;

// export const lessThanEqual = (max: number) => (val: number) =>
//   val <= max || `expected ${val} to be less than or equal ${max}`;

// export const instanceOf = <TPrototype>(proto: new () => TPrototype) => (
//   val: TPrototype
// ) =>
//   val instanceof proto || [
//     `expected value to be instance of class`,
//     proto,
//     val?.constructor,
//   ];

// export const aNull = () => (val) =>
//   val === null || [`expected value to be null`, null, val];

// export const anUndefined = () => (val) =>
//   typeof val === 'undefined' || [
//     `expected value to be undefined`,
//     undefined,
//     val,
//   ];

// export const truthy = () => (val) =>
//   Boolean(val) === true || ['expected value to be truthy', true, val];
