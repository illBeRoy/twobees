import deepEqual from 'fast-deep-equal';
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

  if (actual.mock.calls.length === 0) {
    return 'The mock was never called at all';
  }

  const lastCall = actual.mock.calls[actual.mock.calls.length - 1];
  if (areCallsEqual(lastCall, args)) {
    return true;
  } else {
    return [
      'The last call of the function did not match expectations',
      args,
      [...lastCall],
    ];
  }
};

// nthCalledWith

// returning

// returningWith

// lastReturningWith

// returningInNthTimeWith

const areCallsEqual = (call1: unknown[], call2: unknown[]) =>
  call1.length === call2.length &&
  call1.every((_, i) => deepEqual(call1[i], call2[i]));
