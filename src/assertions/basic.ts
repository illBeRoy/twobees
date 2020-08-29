import deepEqual from 'fast-deep-equal';
import { isPromise } from '../promise';
import { expect } from '../expect';

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

export const withProperty = (key: string, value?: unknown) =>
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

export const falsy = (actual) =>
  Boolean(actual) === false ||
  `Expected value to be falsy, but instead it was ${actual}`;

export const truthy = (actual) =>
  Boolean(actual) === true ||
  `Expected value to be truthy, but instead it was ${actual}`;

export const greaterThan = (min: number) => (actual: number) => {
  if (typeof actual !== 'number') {
    return 'The given value is not a number';
  }

  if (actual > min) {
    return true;
  } else {
    return `Expected ${actual} to be greater than ${min}`;
  }
};

export const greaterThanEqual = (min: number) => (actual: number) => {
  if (typeof actual !== 'number') {
    return 'The given value is not a number';
  }

  if (actual >= min) {
    return true;
  } else {
    return `Expected ${actual} to be greater than or equal ${min}`;
  }
};

export const lessThan = (max: number) => (actual: number) => {
  if (typeof actual !== 'number') {
    return 'The given value is not a number';
  }

  if (actual < max) {
    return true;
  } else {
    return `Expected ${actual} to be less than ${max}`;
  }
};

export const lessThanEqual = (max: number) => (actual: number) => {
  if (typeof actual !== 'number') {
    return 'The given value is not a number';
  }

  if (actual <= max) {
    return true;
  } else {
    return `Expected ${actual} to be less than or equal ${max}`;
  }
};

export const instanceOf = <TPrototype>(proto: new () => TPrototype) => (
  actual: TPrototype
) => {
  if (actual instanceof proto) {
    return true;
  } else {
    return `Expected value to be an instance of ${proto.name}, but it wasn't`;
  }
};

export const aNull = (actual) =>
  actual === null || [`Expected value to be null, but it wasn't`, null, actual];

export const anUndefined = (actual) =>
  typeof actual === 'undefined' || [
    `Expected value to be undefined, but it wasn't`,
    undefined,
    actual,
  ];

export const aNaN = (actual) =>
  Number.isNaN(actual) || [
    `Expected value to be NaN, but it wasn't`,
    NaN,
    actual,
  ];

export const havingSameElementsAs = <T>(expected: T[]) => (actual: T[]) => {
  if (!(actual instanceof Array)) {
    return 'The given value is not an array';
  }

  if (
    actual.length === expected.length &&
    actual.every((actualItem) =>
      expected.some((expectedItem) => deepEqual(actualItem, expectedItem))
    )
  ) {
    return true;
  } else {
    return [
      'The given array does not have the exact same elements as expected',
      expected,
      actual,
    ];
  }
};

export const aSupersetOf = <T>(expected: T[]) => (actual: T[]) => {
  if (!(actual instanceof Array)) {
    return 'The given value is not an array';
  }

  if (
    expected.every((expectedItem) =>
      actual.some((actualItem) => deepEqual(actualItem, expectedItem))
    )
  ) {
    return true;
  } else {
    return [
      'The given array is not a superset of the expected array',
      expected,
      actual,
    ];
  }
};

export const aSubsetOf = <T>(expected: T[]) => (actual: T[]) => {
  if (!(actual instanceof Array)) {
    return 'The given value is not an array';
  }

  if (
    actual.every((actualItem) =>
      expected.some((expectedItem) => deepEqual(actualItem, expectedItem))
    )
  ) {
    return true;
  } else {
    return [
      'The given array is not a subset of the expected array',
      expected,
      actual,
    ];
  }
};

export const matching = (expected: RegExp | string) => (actual: string) => {
  if (typeof actual !== 'string') {
    return 'The given value is not a string';
  }

  if (typeof expected === 'string') {
    return (
      actual.includes(expected) || [
        'The given value does not contain the expected string',
        expected,
        actual,
      ]
    );
  } else if (expected instanceof RegExp) {
    return (
      expected.test(actual) || [
        'The given value was not matched by the expected regex',
        expected,
        actual,
      ]
    );
  } else {
    return 'The expected value is not a string neither a regex!';
  }
};

export const throwing = (actual: () => unknown) => {
  if (typeof actual !== 'function') {
    return `Given value is not a function`;
  }

  try {
    actual();
    return `Expected function to throw, but it didn't`;
  } catch (err) {
    return true;
  }
};

export const throwingWith = (
  expected: Error | (new (...args: unknown[]) => Error) | RegExp | string
) => (actual: () => unknown) => {
  let error;
  try {
    actual();
    return false;
  } catch (err) {
    error = err;
  }

  if (typeof error === 'string') {
    if (typeof expected === 'function') {
      return 'The thrown object was a string, therefore it cannot be an instance of the expected class';
    }

    if (typeof expected === 'object' && 'message' in expected) {
      return 'The thrown object was a string, therefore it cannot be matched against the expected error instance';
    }

    if (typeof expected === 'string') {
      if (error.includes(expected)) {
        return true;
      } else {
        return [
          'The thrown string does not contain the expected message',
          expected,
          error,
        ];
      }
    }

    if (expected instanceof RegExp) {
      if (expected.test(error)) {
        return true;
      } else {
        return `The thrown string could not be matched by the expected regex (string: "${error}")`;
      }
    }

    return true;
  }

  if (error && typeof error === 'object') {
    if (typeof expected === 'function') {
      if (error instanceof expected) {
        return true;
      } else {
        return `The thrown error is not an instance of ${expected.name}`;
      }
    }

    if (typeof expected === 'object' && 'message' in expected) {
      if (error?.message === expected?.message) {
        return true;
      } else {
        return ['The thrown error is different than expected', expected, error];
      }
    }

    if (typeof expected === 'string') {
      if ((error?.message ?? '').includes(expected)) {
        return true;
      } else {
        return [
          `The thrown error does not contain the expected message`,
          expected,
          error?.message,
        ];
      }
    }

    if (expected instanceof RegExp) {
      if (expected.test(error?.message ?? '')) {
        return true;
      } else {
        return `The thrown error's message could not be matched by the expected regex (message: "${
          error?.message ?? ''
        }")`;
      }
    }
  }

  return 'The thrown value was not an Error instance nor a string';
};

export const resolved = async (actual: Promise<unknown>) => {
  if (isPromise(actual)) {
    return actual
      .then(() => true)
      .catch(() => 'Expected promise to resolve, but it rejected');
  } else {
    return `Given value is not a promise`;
  }
};

export const resolvedWith = <T>(expected: T) => async (actual: Promise<T>) => {
  if (!isPromise(actual)) {
    return `Given value is not a promise`;
  }

  let resolvedValue: T;
  try {
    resolvedValue = await actual;
  } catch (err) {
    return 'Expected promise to resolve, but it rejected';
  }
  if (deepEqual(expected, resolvedValue)) {
    return true;
  } else {
    return [
      'Promise resolved to a different value than expected',
      expected,
      resolvedValue,
    ];
  }
};

export const rejected = async (actual: Promise<unknown>) => {
  if (isPromise(actual)) {
    return actual
      .then(() => `Expected promise to reject, but it didn't`)
      .catch(() => true);
  } else {
    return `Given value is not a promise`;
  }
};

export const rejectedWith = (
  expected: Error | (new (...args: unknown[]) => Error) | RegExp | string
) => async (actual: Promise<unknown>) => {
  if (isPromise(actual)) {
    return actual
      .then(() => `Expected promise to reject, but it didn't`)
      .catch((err) => {
        expect(() => {
          throw err;
        }).toBe(throwingWith(expected));
        return true;
      });
  } else {
    return `Given value is not a promise`;
  }
};

// rejectedWith
