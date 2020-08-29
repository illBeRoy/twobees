import { Chance } from 'chance';
import { expect } from '../../src';
import { failingTheAssertion } from '../utils/assertions';
import { aRandomPrimitive } from '../utils/values';
import {
  calledWith,
  called,
  aJestMock,
  calledTimes,
  lastCalledWith,
  nthCalledWith,
} from '../../src/assertions/jest';

describe('jest assertions', () => {
  describe('expect(a).toBe(aJestMock)', () => {
    it('should pass if a is a jest mock', () => {
      const fn = jest.fn();
      expect(fn).toBe(aJestMock);
    });

    it('should fail if a is not a jest mock', () => {
      const fn = () => void 0;
      expect(fn).not.toBe(aJestMock);
    });

    it('should fail with the correct error', () => {
      const fn = () => void 0;
      expect(fn).toBe(
        failingTheAssertion(aJestMock, {
          withMessage: 'The given value is not a jest mock',
        })
      );
    });
  });

  describe('expect(a).toBe(called)', () => {
    it('should pass if a is a jest mock that was called', () => {
      const fn = jest.fn();
      fn();
      expect(fn).toBe(called);
    });

    it('should fail if a is a jest mock that never called', () => {
      const fn = jest.fn();
      expect(fn).not.toBe(called);
    });

    it('should fail if a is not a jest mock', () => {
      const fn = () => void 0;
      expect(fn).not.toBe(called);
    });

    it('should fail with the correct error for a being a jest mock that never called', () => {
      const fn = jest.fn();
      expect(fn).toBe(
        failingTheAssertion(called, {
          withMessage:
            'Expected mock to have been called, but it was not called even once',
        })
      );
    });

    it('should fail with the correct error for a not being a jest mock', () => {
      const fn = () => void 0;
      expect(fn).toBe(
        failingTheAssertion(called, {
          withMessage: 'The given value is not a jest mock',
        })
      );
    });
  });

  describe('expect(a).toBe(calledTimes(n))', () => {
    it('should pass if a was called n times', () => {
      const fn = jest.fn();
      const n = Chance().integer({ min: 0, max: 100 });
      Chance().n(fn, n);
      expect(fn).toBe(calledTimes(n));
    });

    it('should fail if a was not called n times', () => {
      const fn = jest.fn();
      const n = Chance().integer({ min: 0, max: 100 });
      Chance().n(fn, n + 1);
      expect(fn).not.toBe(calledTimes(n));
    });

    it('should fail if a is not a jest mock', () => {
      const a = () => void 0;
      const n = Chance().integer({ min: 0, max: 100 });
      expect(a).not.toBe(calledTimes(n));
    });

    it('should fail with the correct error for a not being called n times', () => {
      const fn = jest.fn();
      const n = Chance().integer({ min: 0, max: 100 });
      Chance().n(fn, n + 1);
      expect(fn).toBe(
        failingTheAssertion(calledTimes(n), {
          withMessage: `The mock was not called the expected amount of times`,
          withExpectedValue: n,
          withActualValue: n + 1,
        })
      );
    });

    it('should fail if a is not a jest mock', () => {
      const a = () => void 0;
      const n = Chance().integer({ min: 0, max: 100 });
      expect(a).toBe(
        failingTheAssertion(calledTimes(n), {
          withMessage: 'The given value is not a jest mock',
        })
      );
    });
  });

  describe('expect(a).toBe(calledWith(...args))', () => {
    it('should pass if a is a jest mock that was called with ...args', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn(...args);
      expect(fn).toBe(calledWith(...args));
    });

    it('should pass if a is a jest mock that was called with ...args, even if it was not the first call', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn();
      fn(...args);
      fn();
      expect(fn).toBe(calledWith(...args));
    });

    it('should fail if a was never called with ...args', () => {
      const fn = jest.fn();
      const expectedArgs = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      const actualArgs = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn(...actualArgs);
      expect(fn).not.toBe(calledWith(...expectedArgs));
    });

    it('should fail if a is not a jest mock', () => {
      const fn = (...args) => void 0;
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn(...args);
      expect(fn).not.toBe(calledWith(...args));
    });

    it('should fail with the correct error for a not being called with ...args', () => {
      const fn = jest.fn();
      const expectedArgs = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      const actualArgs = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn(...actualArgs);
      expect(fn).toBe(
        failingTheAssertion(calledWith(...expectedArgs), {
          withMessage: 'The mock was never called with the expected arguments',
        })
      );
    });

    it('should fail with the correct error for a not being a jest mock', () => {
      const fn = (...args) => void 0;
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn(...args);
      expect(fn).toBe(
        failingTheAssertion(calledWith(...args), {
          withMessage: 'The given value is not a jest mock',
        })
      );
    });
  });

  describe('expect(a).toBe(lastCalledWith(...args))', () => {
    it('should pass if a is a jest mock whose last invocation was using the given args', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn();
      fn();
      fn(...args);
      expect(fn).toBe(lastCalledWith(...args));
    });

    it('should fail if a is a jest mock whose last invocation was not using the given args', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      const args2 = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn();
      fn(...args);
      fn(...args2);
      expect(fn).not.toBe(lastCalledWith(...args));
    });

    it('should fail if a is a jest mock that was never called at all', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      expect(fn).not.toBe(lastCalledWith(...args));
    });

    it('should fail if a is not a jest mock', () => {
      const fn = () => void 0;
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      expect(fn).not.toBe(lastCalledWith(...args));
    });

    it('should fail with the correct error for a being a jest mock whose last invocation was not using the given args', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      const args2 = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn();
      fn(...args);
      fn(...args2);
      expect(fn).toBe(
        failingTheAssertion(lastCalledWith(...args), {
          withMessage:
            'The 3rd (and last) call of the mock did not match expectations',
          withExpectedValue: args,
          withActualValue: args2,
        })
      );
    });

    it('should fail with the correct error for a being a jest mock that was never called at all', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      expect(fn).toBe(
        failingTheAssertion(lastCalledWith(...args), {
          withMessage: 'The mock was never called at all',
        })
      );
    });

    it('should fail with the correct error for a not being a jest mock', () => {
      const fn = () => void 0;
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      expect(fn).toBe(
        failingTheAssertion(lastCalledWith(...args), {
          withMessage: 'The given value is not a jest mock',
        })
      );
    });
  });

  describe('expect(a).toBe(nthCalledWith(n, ...args))', () => {
    it('should pass if a is a jest mock whose nth invocation was using the given args', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn();
      fn(...args);
      fn();
      expect(fn).toBe(nthCalledWith(2, ...args));
    });

    it('should fail if a is a jest mock whose nth invocation was not using the given args', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      const args2 = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn();
      fn(...args2);
      fn(...args);
      expect(fn).not.toBe(nthCalledWith(2, ...args));
    });

    it("should fail if n is out of range of a's invocations", () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn();
      fn(...args);
      expect(fn).not.toBe(nthCalledWith(3, ...args));
    });

    it('should fail if a is a jest mock that was never called at all', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      expect(fn).not.toBe(nthCalledWith(Chance().integer({ min: 1 }), ...args));
    });

    it('should fail if a is not a jest mock', () => {
      const fn = () => void 0;
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      expect(fn).not.toBe(nthCalledWith(Chance().integer({ min: 1 }), ...args));
    });

    it('should fail with the correct error for a being a jest mock whose nth invocation was not using the given args', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      const args2 = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn();
      fn(...args2);
      fn(...args);
      expect(fn).toBe(
        failingTheAssertion(nthCalledWith(2, ...args), {
          withMessage: `The 2nd call of the mock did not match expectations`,
          withActualValue: args2,
          withExpectedValue: args,
        })
      );
    });

    it("should fail with the correct error for n being out of range of a's invocations", () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      fn();
      fn(...args);
      expect(fn).toBe(
        failingTheAssertion(nthCalledWith(3, ...args), {
          withMessage: `The mock was never called a 3rd time (calls: 2)`,
        })
      );
    });

    it('should fail with the correct error for a being a jest mock that was never called at all', () => {
      const fn = jest.fn();
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      expect(fn).toBe(
        failingTheAssertion(
          nthCalledWith(Chance().integer({ min: 1 }), ...args),
          { withMessage: 'The mock was never called at all' }
        )
      );
    });

    it('should fail with the correct error for a not being a jest mock', () => {
      const fn = () => void 0;
      const args = Chance().n(
        aRandomPrimitive,
        Chance().integer({ min: 1, max: 10 })
      );
      expect(fn).toBe(
        failingTheAssertion(
          nthCalledWith(Chance().integer({ min: 1 }), ...args),
          { withMessage: 'The given value is not a jest mock' }
        )
      );
    });
  });
});
