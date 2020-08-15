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

export const throwing = (actual: () => any) => {
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

// throwWith
// reject
// rejectWith
