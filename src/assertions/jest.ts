import deepEqual from 'fast-deep-equal';
import ordinal from 'ordinal';
import { expect } from '../expect';

export const aJestMock = (actual: unknown) => {
  if (actual && typeof actual === 'function' && 'mock' in actual) {
    return true;
  } else {
    return 'The given value is not a jest mock';
  }
};

export const called = (actual: jest.Mock) => {
  expect(actual).toBe(aJestMock);

  if (actual.mock.calls.length > 0) {
    return true;
  } else {
    return 'Expected mock to have been called, but it was not called even once';
  }
};

export const calledTimes = (n: number) => (actual: jest.Mock) => {
  expect(actual).toBe(aJestMock);

  if (actual.mock.calls.length === n) {
    return true;
  } else {
    return [
      `The mock was not called the expected amount of times`,
      n,
      actual.mock.calls.length,
    ];
  }
};

export const calledWith = <TArgs extends unknown[]>(...args: TArgs) => (
  actual: jest.Mock
) => {
  expect(actual).toBe(aJestMock);

  if (actual.mock.calls.some((callArgs) => areCallsEqual(callArgs, args))) {
    return true;
  } else {
    return 'The mock was never called with the expected arguments';
  }
};

export const lastCalledWith = <TArgs extends unknown[]>(...args: TArgs) => (
  actual: jest.Mock
) => {
  expect(actual).toBe(aJestMock);
  const callCount = actual.mock.calls.length;
  expect(actual).toBe(nthCalledWith(callCount, ...args));
  return true;
};

export const nthCalledWith = <TArgs extends unknown[]>(
  n: number,
  ...args: TArgs
) => (actual: jest.Mock) => {
  expect(actual).toBe(aJestMock);

  if (actual.mock.calls.length === 0) {
    return 'The mock was never called at all';
  }

  const nthCall = actual.mock.calls[n - 1];
  if (!nthCall) {
    return `The mock was never called a ${ordinal(n)} time (calls: ${
      actual.mock.calls.length
    })`;
  }

  if (areCallsEqual(nthCall, args)) {
    return true;
  } else {
    const isLastCall = n === actual.mock.calls.length;
    return [
      `The ${ordinal(n)}${
        isLastCall ? ` (and last)` : ''
      } call of the mock did not match expectations`,
      args,
      [...nthCall],
    ];
  }
};

export const returning = (actual: jest.Mock) => {
  expect(actual).toBe(aJestMock);

  if (actual.mock.calls.length === 0) {
    return 'The mock was never called at all';
  }

  const hasReturnedOnce = actual.mock.results.some(
    (result) => result.type === 'return'
  );

  if (hasReturnedOnce) {
    return true;
  } else {
    return 'The mock never finished running successfully';
  }
};

export const returningWith = (expected: unknown) => (actual: jest.Mock) => {
  expect(actual).toBe(aJestMock);
  expect(actual).toBe(returning);

  const hasReturnedWithExpectedValue = actual.mock.results.some(
    (result) => result.type === 'return' && deepEqual(result.value, expected)
  );
  if (hasReturnedWithExpectedValue) {
    return true;
  } else {
    return `The mock has never returned with the expected value`;
  }
};

export const lastReturningWith = (expected: unknown) => (actual: jest.Mock) => {
  expect(actual).toBe(aJestMock);
  expect(actual).toBe(returning);
  const callCount = actual.mock.calls.length;
  expect(actual).toBe(nthReturningWith(callCount, expected));
  return true;
};

export const nthReturningWith = (n: number, expected: unknown) => (
  actual: jest.Mock
) => {
  expect(actual).toBe(aJestMock);
  expect(actual).toBe(returning);

  const nthCall = actual.mock.results[n - 1];

  if (!nthCall) {
    return `The mock was never called a ${ordinal(n)} time (calls: ${
      actual.mock.calls.length
    })`;
  }

  const isLastCall = n === actual.mock.calls.length;

  if (nthCall.type !== 'return') {
    return `Expected the ${ordinal(n)}${
      isLastCall ? ' (and last)' : ''
    } call of the error to return, but it threw instead`;
  }

  if (nthCall.type === 'return' && deepEqual(nthCall.value, expected)) {
    return true;
  } else {
    return [
      `The ${ordinal(n)}${
        isLastCall ? ' (and last)' : ''
      } call of the mock did not return the expected value`,
      expected,
      nthCall.value,
    ];
  }
};

const areCallsEqual = (call1: unknown[], call2: unknown[]) =>
  call1.length === call2.length &&
  call1.every((_, i) => deepEqual(call1[i], call2[i]));
