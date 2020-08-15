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

// export const withLength = (length: number) => (arr: any[]) =>
//   arr.length === length || [
//     `expected array to have length of ${length}`,
//     length,
//     arr.length,
//   ];

// export const withProperty = (key: string, value?: any) => (val) => {
//   if (typeof val !== 'object' || key in val) {
//     return `expected value to contain propety "${key}"`;
//   }

//   if (value !== undefined && val[key] !== value) {
//     return [
//       `expected obj["${key}"] to have a different value`,
//       value,
//       val[key],
//     ];
//   }
// };

// export const between = (min: number, max: number) => (val: number) =>
//   (min <= val && val <= max) ||
//   `expected ${val} to be in range [${min}, ${max}]`;

// export const defined = () => (val) =>
//   typeof val !== 'undefined' || `expected value to be defined`;

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
