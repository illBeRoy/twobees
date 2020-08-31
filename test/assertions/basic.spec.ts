import { Chance } from 'chance';
import { aRandomPrimitive, aRandomArray, aValueThatIs } from '../utils/values';
import { failingTheAssertion } from '../utils/assertions';
import { BaseError } from '../../src/errors';
import { expect } from '../../src';
import {
  sameAs,
  equal,
  withLength,
  withProperty,
  defined,
  between,
  falsy,
  greaterThan,
  greaterThanEqual,
  lessThan,
  lessThanEqual,
  instanceOf,
  aNull,
  anUndefined,
  aNaN,
  truthy,
  havingSameElementsAs,
  aSupersetOf,
  aSubsetOf,
  matching,
  throwing,
  throwingWith,
  eventually,
  rejected,
  rejectedWith,
  resolved,
  resolvedWith,
} from '../../src/assertions/basic';

describe('basic assertions', () => {
  describe('expect(a).toBe(sameAs(e))', () => {
    it('should pass if a === e', () => {
      const val = aRandomPrimitive();
      expect(val).toBe(sameAs(val));
    });

    it('should fail if a !== e', () => {
      const a = aRandomPrimitive();
      const e = aValueThatIs(aRandomPrimitive, { not: a });
      expect(a).not.toBe(sameAs(e));
    });

    it('should fail even if a and e are objects with the same members, as this is not a deep equality', () => {
      const a = { someKey: 'someValue' };
      const e = { someKey: 'someValue' };
      expect(a).not.toBe(sameAs(e));
    });

    it('should fail with the correct error', () => {
      const a = aRandomPrimitive();
      const e = aValueThatIs(aRandomPrimitive, { not: a });
      expect(a).toBe(
        failingTheAssertion(sameAs(e), {
          withMessage:
            'Expected values to be strictly equal (===), but they were not',
          withActualValue: a,
          withExpectedValue: e,
        })
      );
    });
  });

  describe('expect(a).toBe(equal(e))', () => {
    it('should pass if a === e', () => {
      const val = aRandomPrimitive();
      expect(val).toBe(equal(val));
    });

    it('should pass if a deep equals e', () => {
      const a = { someKey: 'someValue' };
      const e = { someKey: 'someValue' };
      expect(a).toBe(equal(e));
    });

    it('should fail if a !== e', () => {
      const a = aRandomPrimitive();
      const e = aValueThatIs(aRandomPrimitive, { not: a });
      expect(a).not.toBe(equal(e));
    });

    it('should fail if a not deep equals e', () => {
      const a = { someKey: 'someValue' };
      const e = { someKey: 'someOtherValue' };
      expect(a).not.toBe(equal(e));
    });

    it('should fail with the correct error message', () => {
      const a = aRandomPrimitive();
      const e = aValueThatIs(aRandomPrimitive, { not: a });
      expect(a).toBe(
        failingTheAssertion(equal(e), {
          withMessage: 'Expected values to be deeply equal, but they were not',
          withExpectedValue: e,
          withActualValue: a,
        })
      );
    });
  });

  describe('expect(a).toBe(withLength(e))', () => {
    it('should pass if a is an array with length e', () => {
      const e = Chance().integer({ min: 0, max: 100 });
      const a = aRandomArray({ length: e });
      expect(a).toBe(withLength(e));
    });

    it('should pass if a is a string with length e', () => {
      const e = Chance().integer({ min: 0, max: 100 });
      const a = Chance().string({ length: e });
      expect(a).toBe(withLength(e));
    });

    it('should fail if a is an array with length !== e', () => {
      const e = Chance().integer({ min: 0, max: 100 });
      const a = aRandomArray({ length: e + 1 });
      expect(a).not.toBe(withLength(e));
    });

    it('should fail if a is a string with length !== e', () => {
      const e = Chance().integer({ min: 0, max: 100 });
      const a = Chance().string({ length: e + 1 });
      expect(a).not.toBe(withLength(e));
    });

    it('should fail if value is not an array or string', () => {
      const e = Chance().integer({ min: 0, max: 100 });
      const a = Chance().pickone([null, undefined, 78, true, {}]);
      expect(a).not.toBe(withLength(e));
    });

    it('should fail with the correct message for incompatible lengths', () => {
      const e = Chance().integer({ min: 0, max: 100 });
      const a = aRandomArray({ length: e + 1 });
      expect(a).toBe(
        failingTheAssertion(withLength(e), {
          withMessage: 'The given value had an incorrect length',
          withActualValue: a.length,
          withExpectedValue: e,
        })
      );
    });

    it('should fail with the correct message for non string / array values', () => {
      const e = Chance().integer({ min: 0, max: 100 });
      const a = Chance().pickone([null, undefined, 78, true, {}]);
      expect(a).toBe(
        failingTheAssertion(withLength(e), {
          withMessage: 'The given value is not an array nor a string',
        })
      );
    });
  });

  describe('expect(a).toBe(withProperty(key, value?))', () => {
    it('should pass if a contains a key <key>', () => {
      const key = Chance().string();
      const value = aRandomPrimitive();
      const a = { [key]: value };
      expect(a).toBe(withProperty(key));
    });

    it('should pass if a[key] === value', () => {
      const key = Chance().string();
      const value = aRandomPrimitive();
      const a = { [key]: value };
      expect(a).toBe(withProperty(key, value));
    });

    it('should pass if a[key] deep equals value', () => {
      const key = Chance().string();
      const value = { foo: 'bar' };
      const a = { [key]: { foo: 'bar' } };
      expect(a).toBe(withProperty(key, value));
    });

    it('should fail if a does not contain a key <key>', () => {
      const key = Chance().string();
      const a = { [Chance().string()]: Chance().string() };
      expect(a).not.toBe(withProperty(key));
    });

    it('should fail if a[key] does not deep equal value', () => {
      const key = Chance().string();
      const value = aRandomPrimitive();
      const a = { [key]: aValueThatIs(aRandomPrimitive, { not: value }) };
      expect(a).not.toBe(withProperty(key, value));
    });

    it('should fail if a is not an object', () => {
      const key = Chance().string();
      const a = aRandomPrimitive();
      expect(a).not.toBe(withProperty(key));
    });

    it('should fail if a is null', () => {
      const key = Chance().string();
      const a = null;
      expect(a).not.toBe(withProperty(key));
    });

    it('should fail with correct message for object not containing a key', () => {
      const key = Chance().string();
      const a = { [Chance().string()]: Chance().string() };
      expect(a).toBe(
        failingTheAssertion(withProperty(key), {
          withMessage: `The object does not contain the key "${key}"`,
        })
      );
    });

    it('should fail with correct message for object not containing a key, even if checking value in addition to key', () => {
      const key = Chance().string();
      const value = aRandomPrimitive();
      const a = { [Chance().string()]: Chance().string() };
      expect(a).toBe(
        failingTheAssertion(withProperty(key, value), {
          withMessage: `The object does not contain the key "${key}"`,
        })
      );
    });

    it('should fail with correct message for object that contains a different value than expected', () => {
      const key = Chance().string();
      const value = aRandomPrimitive();
      const a = { [key]: aValueThatIs(aRandomPrimitive, { not: value }) };
      expect(a).toBe(
        failingTheAssertion(withProperty(key, value), {
          withMessage: `The object contains a value other than expected at property "${key}"`,
          withExpectedValue: value,
          withActualValue: a[key],
        })
      );
    });

    it('should fail with correct message for actual value not being an object', () => {
      const key = Chance().string();
      const a = aRandomPrimitive();
      expect(a).toBe(
        failingTheAssertion(withProperty(key), {
          withMessage: `The given value is not an object`,
        })
      );
    });
  });

  describe('expect(a).toBe(between(min, max))', () => {
    it('should pass if min <= a <= max', () => {
      const min = Chance().integer();
      const max = Chance().integer({ min });
      const a = Chance().integer({ min, max });
      expect(a).toBe(between(min, max));
    });

    it('should pass even if min and max switched places', () => {
      const min = Chance().integer();
      const max = Chance().integer({ min });
      const a = Chance().integer({ min, max });
      expect(a).toBe(between(max, min));
    });

    it('should fail if a < min', () => {
      const min = Chance().integer();
      const max = Chance().integer({ min });
      const a = Chance().integer({ max: min - 1 });
      expect(a).not.toBe(between(min, max));
    });

    it('should fail if a > max', () => {
      const min = Chance().integer();
      const max = Chance().integer({ min });
      const a = Chance().integer({ min: max + 1 });
      expect(a).not.toBe(between(min, max));
    });

    it('should fail a is not a number', () => {
      const min = Chance().integer();
      const max = Chance().integer({ min });
      const a = Chance().pickone([
        Chance().bool(),
        Chance().string(),
        {},
        [],
        undefined,
        null,
      ]);
      expect(a).not.toBe(between(min, max));
    });

    it('should fail with correct message for actual value not being in range', () => {
      const min = Chance().integer();
      const max = Chance().integer({ min });
      const a = Chance().integer({ max: min - 1 });
      expect(a).toBe(
        failingTheAssertion(between(min, max), {
          withMessage: `Expected ${a} to be in range [${min}, ${max}]`,
        })
      );
    });

    it('should fail with correct message for actual value not being a number', () => {
      const min = Chance().integer();
      const max = Chance().integer({ min });
      const a = Chance().pickone([
        Chance().bool(),
        Chance().string(),
        {},
        [],
        undefined,
        null,
      ]);
      expect(a).toBe(
        failingTheAssertion(between(min, max), {
          withMessage: `The given value is not a number`,
        })
      );
    });
  });

  describe('expect(a).toBe(defined)', () => {
    it('should pass if a is defined', () => {
      const a = aValueThatIs(aRandomPrimitive, { not: undefined });
      expect(a).toBe(defined);
    });

    it('should pass if a is null', () => {
      const a = null;
      expect(a).toBe(defined);
    });

    it('should pass if a is falsy', () => {
      const a = Chance().pickone([false, '', 0]);
      expect(a).toBe(defined);
    });

    it('should fail if a is undefined', () => {
      const a = undefined;
      expect(a).not.toBe(defined);
    });

    it('should fail with the correct error', () => {
      const a = undefined;
      expect(a).toBe(
        failingTheAssertion(defined, {
          withMessage: `Expected value to be defined, but it wasn't`,
        })
      );
    });
  });

  describe('expect(a).toBe(falsy)', () => {
    it('should pass if a is false', () => {
      const a = false;
      expect(a).toBe(falsy);
    });

    it('should pass if a is 0', () => {
      const a = 0;
      expect(a).toBe(falsy);
    });

    it('should pass if a is empty string', () => {
      const a = '';
      expect(a).toBe(falsy);
    });

    it('should pass if a is null', () => {
      const a = null;
      expect(a).toBe(falsy);
    });

    it('should pass if a is undefined', () => {
      const a = undefined;
      expect(a).toBe(falsy);
    });

    it('should pass if a is NaN', () => {
      const a = NaN;
      expect(a).toBe(falsy);
    });

    it('should fail if value is not falsy', () => {
      const a = Chance().pickone([
        Chance().string(),
        Chance().integer(),
        true,
        {},
        [],
      ]);
      expect(a).not.toBe(falsy);
    });

    it('should fail with the correct error', () => {
      const a = Chance().pickone([
        Chance().string(),
        Chance().integer(),
        true,
        {},
        [],
      ]);
      expect(a).toBe(
        failingTheAssertion(falsy, {
          withMessage: `Expected value to be falsy, but instead it was ${a}`,
        })
      );
    });
  });

  describe('expect(a).toBe(truthy)', () => {
    it('should pass if a is truthy', () => {
      const a = Chance().pickone([
        Chance().string(),
        Chance().integer(),
        true,
        new Date(),
        {},
        [],
      ]);
      expect(a).toBe(truthy);
    });

    it('should fail if a is false', () => {
      const a = false;
      expect(a).not.toBe(truthy);
    });

    it('should fail if a is 0', () => {
      const a = 0;
      expect(a).not.toBe(truthy);
    });

    it('should fail if a is empty string', () => {
      const a = '';
      expect(a).not.toBe(truthy);
    });

    it('should fail if a is null', () => {
      const a = null;
      expect(a).not.toBe(truthy);
    });

    it('should fail if a is undefined', () => {
      const a = undefined;
      expect(a).not.toBe(truthy);
    });

    it('should fail if a is NaN', () => {
      const a = NaN;
      expect(a).not.toBe(truthy);
    });

    it('should fail with the correct error', () => {
      const a = Chance().pickone([false, 0, '', null, undefined, NaN]);
      expect(a).toBe(
        failingTheAssertion(truthy, {
          withMessage: `Expected value to be truthy, but instead it was ${a}`,
        })
      );
    });
  });

  describe('expect(a).toBe(greaterThan(e))', () => {
    it('should pass if a > e', () => {
      const e = Chance().integer();
      const a = Chance().integer({ min: e });
      expect(a).toBe(greaterThan(e));
    });

    it('should fail if a <= e', () => {
      const e = Chance().integer();
      const a = Chance().integer({ max: e });
      expect(a).not.toBe(greaterThan(e));
    });

    it('should fail if a is not a number', () => {
      const e = Chance().integer();
      const a = Chance().pickone([
        Chance().string(),
        {},
        [],
        Chance().bool(),
        '123',
      ]);
      expect(a).not.toBe(greaterThan(e));
    });

    it('should fail with the correct message for a not being greater than expected', () => {
      const e = Chance().integer();
      const a = Chance().integer({ max: e });
      expect(a).toBe(
        failingTheAssertion(greaterThan(e), {
          withMessage: `Expected ${a} to be greater than ${e}`,
        })
      );
    });

    it('should fail with the correct message for a not being a number at all', () => {
      const e = Chance().integer();
      const a = Chance().pickone([
        Chance().string(),
        {},
        [],
        Chance().bool(),
        '123',
      ]);
      expect(a).toBe(
        failingTheAssertion(greaterThan(e), {
          withMessage: 'The given value is not a number',
        })
      );
    });
  });

  describe('expect(a).toBe(greaterThanEqual(e))', () => {
    it('should pass if a > e', () => {
      const e = Chance().integer();
      const a = Chance().integer({ min: e });
      expect(a).toBe(greaterThanEqual(e));
    });

    it('should pass if a === e', () => {
      const e = Chance().integer();
      const a = e;
      expect(a).toBe(greaterThanEqual(e));
    });

    it('should fail if a < e', () => {
      const e = Chance().integer();
      const a = Chance().integer({ max: e - 1 });
      expect(a).not.toBe(greaterThanEqual(e));
    });

    it('should fail if a is not a number', () => {
      const e = Chance().integer();
      const a = Chance().pickone([
        Chance().string(),
        {},
        [],
        Chance().bool(),
        '123',
      ]);
      expect(a).not.toBe(greaterThanEqual(e));
    });

    it('should fail with the correct message for a not being greater than expected', () => {
      const e = Chance().integer();
      const a = Chance().integer({ max: e });
      expect(a).toBe(
        failingTheAssertion(greaterThanEqual(e), {
          withMessage: `Expected ${a} to be greater than or equal ${e}`,
        })
      );
    });

    it('should fail with the correct message for a not being a number at all', () => {
      const e = Chance().integer();
      const a = Chance().pickone([
        Chance().string(),
        {},
        [],
        Chance().bool(),
        '123',
      ]);
      expect(a).toBe(
        failingTheAssertion(greaterThanEqual(e), {
          withMessage: 'The given value is not a number',
        })
      );
    });
  });

  describe('expect(a).toBe(lessThan(e))', () => {
    it('should pass if a < e', () => {
      const e = Chance().integer();
      const a = Chance().integer({ max: e - 1 });
      expect(a).toBe(lessThan(e));
    });

    it('should fail if a >= e', () => {
      const e = Chance().integer();
      const a = Chance().integer({ min: e });
      expect(a).not.toBe(lessThan(e));
    });

    it('should fail if a is not a number', () => {
      const e = Chance().integer();
      const a = Chance().pickone([
        Chance().string(),
        {},
        [],
        Chance().bool(),
        '123',
      ]);
      expect(a).not.toBe(lessThan(e));
    });

    it('should fail with the correct message for a not being less than expected', () => {
      const e = Chance().integer();
      const a = Chance().integer({ min: e });
      expect(a).toBe(
        failingTheAssertion(lessThan(e), {
          withMessage: `Expected ${a} to be less than ${e}`,
        })
      );
    });

    it('should fail with the correct message for a not being a number at all', () => {
      const e = Chance().integer();
      const a = Chance().pickone([
        Chance().string(),
        {},
        [],
        Chance().bool(),
        '123',
      ]);
      expect(a).toBe(
        failingTheAssertion(lessThan(e), {
          withMessage: 'The given value is not a number',
        })
      );
    });
  });

  describe('expect(a).toBe(lessThanEqual(e))', () => {
    it('should pass if a < e', () => {
      const e = Chance().integer();
      const a = Chance().integer({ max: e - 1 });
      expect(a).toBe(lessThanEqual(e));
    });

    it('should pass if a <= e', () => {
      const e = Chance().integer();
      const a = e;
      expect(a).toBe(lessThanEqual(e));
    });

    it('should fail if a > e', () => {
      const e = Chance().integer();
      const a = Chance().integer({ min: e + 1 });
      expect(a).not.toBe(lessThanEqual(e));
    });

    it('should fail if a is not a number', () => {
      const e = Chance().integer();
      const a = Chance().pickone([
        Chance().string(),
        {},
        [],
        Chance().bool(),
        '123',
      ]);
      expect(a).not.toBe(lessThanEqual(e));
    });

    it('should fail with the correct message for a not being less than expected', () => {
      const e = Chance().integer();
      const a = Chance().integer({ min: e });
      expect(a).toBe(
        failingTheAssertion(lessThanEqual(e), {
          withMessage: `Expected ${a} to be less than or equal ${e}`,
        })
      );
    });

    it('should fail with the correct message for a not being a number at all', () => {
      const e = Chance().integer();
      const a = Chance().pickone([
        Chance().string(),
        {},
        [],
        Chance().bool(),
        '123',
      ]);
      expect(a).toBe(
        failingTheAssertion(lessThanEqual(e), {
          withMessage: 'The given value is not a number',
        })
      );
    });
  });

  describe('expect(a).toBe(instanceOf(e))', () => {
    it('should pass if a is an instance of e', () => {
      class E {}
      const a = new E();
      expect(a).toBe(instanceOf(E));
    });

    it('should fail if a is not an instance of e', () => {
      class E {}
      const a = aRandomPrimitive();
      expect(a).not.toBe(instanceOf(E));
    });

    it('should fail with the correct message', () => {
      class E {}
      const a = aRandomPrimitive();
      expect(a).toBe(
        failingTheAssertion(instanceOf(E), {
          withMessage: `Expected value to be an instance of E, but it wasn't`,
        })
      );
    });
  });

  describe('expect(a).toBe(aNull)', () => {
    it('should pass if a is null', () => {
      const a = null;
      expect(a).toBe(aNull);
    });

    it('should fail if a is not a null', () => {
      const a = aValueThatIs(aRandomPrimitive, { not: null });
      expect(a).not.toBe(aNull);
    });

    it('should fail with the correct error', () => {
      const a = aValueThatIs(aRandomPrimitive, { not: null });
      expect(a).toBe(
        failingTheAssertion(aNull, {
          withMessage: `Expected value to be null, but it wasn't`,
          withExpectedValue: null,
          withActualValue: a,
        })
      );
    });
  });

  describe('expect(a).toBe(anUndefined)', () => {
    it('should pass if a is undefined', () => {
      const a = undefined;
      expect(a).toBe(anUndefined);
    });

    it('should fail if a is not an undefined', () => {
      const a = aValueThatIs(aRandomPrimitive, { not: undefined });
      expect(a).not.toBe(anUndefined);
    });

    it('should fail with the correct error', () => {
      const a = aValueThatIs(aRandomPrimitive, { not: undefined });
      expect(a).toBe(
        failingTheAssertion(anUndefined, {
          withMessage: `Expected value to be undefined, but it wasn't`,
          withExpectedValue: undefined,
          withActualValue: a,
        })
      );
    });
  });

  describe('expect(a).toBe(aNaN)', () => {
    it('should pass if a is NaN', () => {
      const a = NaN;
      expect(a).toBe(aNaN);
    });

    it('should fail if a is not a null', () => {
      const a = aValueThatIs(aRandomPrimitive, { not: NaN });
      expect(a).not.toBe(aNaN);
    });

    it('should fail with the correct error', () => {
      const a = aValueThatIs(aRandomPrimitive, { not: NaN });
      expect(a).toBe(
        failingTheAssertion(aNaN, {
          withMessage: `Expected value to be NaN, but it wasn't`,
          withActualValue: a,
        })
      );
    });
  });

  describe('expect(a).toBe(havingSameElementsAs(e))', () => {
    it('should pass if a contains the same elements as e, by deep equality and in whatever order', () => {
      const a = [{ name: 'roy' }, 23, true, null];
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).toBe(havingSameElementsAs(e));
    });

    it('should fail if a does not contain the same elements as e', () => {
      const a = [42, 'nope'];
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).not.toBe(havingSameElementsAs(e));
    });

    it('should fail if a is subset of e', () => {
      const a = [{ name: 'roy' }, 23, null];
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).not.toBe(havingSameElementsAs(e));
    });

    it('should fail if a is superset of e', () => {
      const a = [{ name: 'roy' }, 23, true, null];
      const e = [true, { name: 'roy' }, null];
      expect(a).not.toBe(havingSameElementsAs(e));
    });

    it('should fail if a is not an array', () => {
      const a = aRandomPrimitive();
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).not.toBe(havingSameElementsAs(e));
    });

    it('should fail with the correct error for a not having the same elements as e', () => {
      const a = [{ name: 'roy' }, 23, null];
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).toBe(
        failingTheAssertion(havingSameElementsAs(e), {
          withMessage:
            'The given array does not have the exact same elements as expected',
          withExpectedValue: e,
          withActualValue: a,
        })
      );
    });

    it('should fail with the correct error for a not being an array', () => {
      const a = aRandomPrimitive();
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).toBe(
        failingTheAssertion(havingSameElementsAs(e), {
          withMessage: 'The given value is not an array',
        })
      );
    });
  });

  describe('expect(a).toBe(aSupersetOf(e))', () => {
    it('should pass if a is superset of e', () => {
      const a = [{ name: 'roy' }, 23, true, null];
      const e = [true, { name: 'roy' }, null];
      expect(a).toBe(aSupersetOf(e));
    });

    it('should fail if a does not contain the same elements as e', () => {
      const a = [42, 'nope'];
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).not.toBe(aSupersetOf(e));
    });

    it('should fail if a is subset of e', () => {
      const a = [{ name: 'roy' }, 23, null];
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).not.toBe(aSupersetOf(e));
    });

    it('should fail if a is not an array', () => {
      const a = aRandomPrimitive();
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).not.toBe(aSupersetOf(e));
    });

    it('should fail with the correct error for a not be a superset of e', () => {
      const a = [{ name: 'roy' }, 23, null];
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).toBe(
        failingTheAssertion(aSupersetOf(e), {
          withMessage:
            'The given array is not a superset of the expected array',
          withExpectedValue: e,
          withActualValue: a,
        })
      );
    });

    it('should fail with the correct error for a not being an array', () => {
      const a = aRandomPrimitive();
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).toBe(
        failingTheAssertion(aSupersetOf(e), {
          withMessage: 'The given value is not an array',
        })
      );
    });
  });

  describe('expect(a).toBe(aSubsetOf(e))', () => {
    it('should pass if a is subset of e', () => {
      const a = [{ name: 'roy' }, 23, null];
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).toBe(aSubsetOf(e));
    });

    it('should fail if a does not contain the same elements as e', () => {
      const a = [42, 'nope'];
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).not.toBe(aSubsetOf(e));
    });

    it('should fail if a is superset of e', () => {
      const a = [{ name: 'roy' }, 23, true, null];
      const e = [true, { name: 'roy' }, null];
      expect(a).not.toBe(aSubsetOf(e));
    });

    it('should fail if a is not an array', () => {
      const a = aRandomPrimitive();
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).not.toBe(aSubsetOf(e));
    });

    it('should fail with the correct error for a not be a subset of e', () => {
      const a = [{ name: 'roy' }, 23, null, true];
      const e = [23, { name: 'roy' }, null];
      expect(a).toBe(
        failingTheAssertion(aSubsetOf(e), {
          withMessage: 'The given array is not a subset of the expected array',
          withExpectedValue: e,
          withActualValue: a,
        })
      );
    });

    it('should fail with the correct error for a not being an array', () => {
      const a = aRandomPrimitive();
      const e = [true, 23, { name: 'roy' }, null];
      expect(a).toBe(
        failingTheAssertion(aSubsetOf(e), {
          withMessage: 'The given value is not an array',
        })
      );
    });
  });

  describe('expect(a).toBe(matching(e))', () => {
    it('should pass if e is a substring of a', () => {
      const e = Chance().string();
      const a = `${Chance().string()}${e}${Chance().string()}`;
      expect(a).toBe(matching(e));
    });

    it('should pass if e is a regex that matches a', () => {
      const e = /abc/;
      const a = `${Chance().string()}abc${Chance().string()}`;
      expect(a).toBe(matching(e));
    });

    it('should fail if e is a string but not a substring of a', () => {
      const e = Chance().string();
      const a = `${Chance().string()}${Chance().string()}`;
      expect(a).not.toBe(matching(e));
    });

    it('should fail if e is a regex that does not match a', () => {
      const e = /abc/;
      const a = `abd`;
      expect(a).not.toBe(matching(e));
    });

    it('should fail if a is not a string', () => {
      const e = Chance().string();
      const a = Chance().pickone([
        null,
        undefined,
        Chance().bool(),
        Chance().integer(),
        {},
        [],
      ]);
      expect(a).not.toBe(matching(e));
    });

    it('should fail with correct error for e being a string but not being a substring of a', () => {
      const e = Chance().string();
      const a = `${Chance().string()}${Chance().string()}`;
      expect(a).toBe(
        failingTheAssertion(matching(e), {
          withMessage: 'The given value does not contain the expected string',
          withExpectedValue: e,
          withActualValue: a,
        })
      );
    });

    it('should fail with correct error for e being a regex that does not match a', () => {
      const e = /abc/;
      const a = `abd`;
      expect(a).toBe(
        failingTheAssertion(matching(e), {
          withMessage: 'The given value was not matched by the expected regex',
          withExpectedValue: e,
          withActualValue: a,
        })
      );
    });

    it('should fail with correct error for a not being a string', () => {
      const e = Chance().string();
      const a = Chance().pickone([
        null,
        undefined,
        Chance().bool(),
        Chance().integer(),
        {},
        [],
      ]);
      expect(a).toBe(
        failingTheAssertion(matching(e), {
          withMessage: 'The given value is not a string',
        })
      );
    });
  });

  describe('expect(a).toBe(throwing)', () => {
    it('should pass if a is a function that is throwing', () => {
      const a = () => {
        throw new Error('throwing!');
      };
      expect(a).toBe(throwing);
    });

    it('should fail if a is a function that is not throwing', () => {
      const a = () => 'ok';
      expect(a).not.toBe(throwing);
    });

    it('should fail if a is not a function', () => {
      const a = aRandomPrimitive();
      expect(a).not.toBe(throwing);
    });

    it('should fail with the correct error for a function that is not throwing', () => {
      const a = () => 'ok';
      expect(a).toBe(
        failingTheAssertion(throwing, {
          withMessage: `Expected function to throw, but it didn't`,
        })
      );
    });

    it('should fail with the correct error for a not being a function', () => {
      const a = aRandomPrimitive();
      expect(a).toBe(
        failingTheAssertion(throwing, {
          withMessage: `Given value is not a function`,
        })
      );
    });
  });

  describe('expect(a).toBe(throwingError(e))', () => {
    it("should pass if e is an Error instance and a throws an error that matches e's message", () => {
      class SomeErrorClass extends BaseError {}
      const message = Chance().sentence();
      const e = new SomeErrorClass(message);
      const a = () => {
        throw new SomeErrorClass(message);
      };
      expect(a).toBe(throwingWith(e));
    });

    it('should pass if e is an Error class and a throws an error that is an instance of e', () => {
      class SomeErrorClass extends BaseError {}
      const a = () => {
        throw new SomeErrorClass(Chance().string());
      };
      expect(a).toBe(throwingWith(SomeErrorClass));
    });

    it('should pass if e is a string, and a throws an error with a message that contains e', () => {
      class SomeErrorClass extends BaseError {}
      const e = Chance().sentence();
      const a = () => {
        throw new SomeErrorClass(
          `${Chance().string()}${e}${Chance().string()}`
        );
      };
      expect(a).toBe(throwingWith(e));
    });

    it('should pass if e is a string, and a throws a string that contains e', () => {
      const e = Chance().sentence();
      const a = () => {
        throw `${Chance().string()}${e}${Chance().string()}`;
      };
      expect(a).toBe(throwingWith(e));
    });

    it('should pass if e is a regex, and a throws an error with a message that matches e', () => {
      class SomeErrorClass extends BaseError {}
      const e = /abc/;
      const a = () => {
        throw new SomeErrorClass('abc');
      };
      expect(a).toBe(throwingWith(e));
    });

    it('should pass if e is a regex, and a throws a string that matches e', () => {
      const e = /abc/;
      const a = () => {
        throw 'abc';
      };
      expect(a).toBe(throwingWith(e));
    });

    it('should fail if e is an Error instance and a throws an error with a different message', () => {
      class SomeErrorClass extends BaseError {}
      const message = Chance().sentence();
      const e = new SomeErrorClass(message);
      const a = () => {
        throw new SomeErrorClass(Chance().sentence());
      };
      expect(a).not.toBe(throwingWith(e));
    });

    it('should fail if e is an Error class and a throws an error that is not an instance of e', () => {
      class SomeErrorClass extends BaseError {}
      class AnotherErrorClass extends BaseError {}
      const a = () => {
        throw new AnotherErrorClass(Chance().string());
      };
      expect(a).not.toBe(throwingWith(SomeErrorClass));
    });

    it('should fail if e is a string, and a throws an error with a message that does not contain e', () => {
      class SomeErrorClass extends BaseError {}
      const e = Chance().sentence();
      const a = () => {
        throw new SomeErrorClass(`${Chance().string()}`);
      };
      expect(a).not.toBe(throwingWith(e));
    });

    it('should fail if e is a regex, and a throws an error with a message that does not match e', () => {
      class SomeErrorClass extends BaseError {}
      const e = /abc/;
      const a = () => {
        throw new SomeErrorClass('abd');
      };
      expect(a).not.toBe(throwingWith(e));
    });

    it('should fail if e is a string, and a throws a string that does not contain e', () => {
      const e = Chance().sentence();
      const a = () => {
        throw `${Chance().string()}`;
      };
      expect(a).not.toBe(throwingWith(e));
    });

    it('should fail if e is a regex, and a throws a string that does not match e', () => {
      const e = /abc/;
      const a = () => {
        throw 'abd';
      };
      expect(a).not.toBe(throwingWith(e));
    });

    it('should fail if a is not an error nor a string', () => {
      const a = () => {
        const invalidThrowable = Chance().pickone([
          null,
          undefined,
          Chance().bool(),
          Chance().integer,
        ]);
        throw invalidThrowable;
      };
      expect(a).not.toBe(throwingWith(Error));
    });

    it('should fail with correct error for e being an Error instance and a throwing an error with a different message', () => {
      class SomeErrorClass extends BaseError {}
      const message = Chance().sentence();
      const e = new SomeErrorClass(message);
      const actualError = new SomeErrorClass(Chance().sentence());
      const a = () => {
        throw actualError;
      };
      expect(a).toBe(
        failingTheAssertion(throwingWith(e), {
          withMessage: 'The thrown error is different than expected',
          withExpectedValue: e,
          withActualValue: actualError,
        })
      );
    });

    it('should fail with correct error for e being an Error class and a throwing an error that is not an instance of e', () => {
      class SomeErrorClass extends BaseError {}
      class AnotherErrorClass extends BaseError {}
      const a = () => {
        throw new AnotherErrorClass(Chance().string());
      };
      expect(a).toBe(
        failingTheAssertion(throwingWith(SomeErrorClass), {
          withMessage: 'The thrown error is not an instance of SomeErrorClass',
        })
      );
    });

    it('should fail with correct error for e being a string, and a throwing an error with a message that does not contain e', () => {
      class SomeErrorClass extends BaseError {}
      const e = Chance().sentence();
      const actualMessage = Chance().string();
      const a = () => {
        throw new SomeErrorClass(actualMessage);
      };
      expect(a).toBe(
        failingTheAssertion(throwingWith(e), {
          withMessage: `The thrown error does not contain the expected message`,
          withExpectedValue: e,
          withActualValue: actualMessage,
        })
      );
    });

    it('should fail with correct error for e being a regex, and a throwing an error with a message that does not match e', () => {
      class SomeErrorClass extends BaseError {}
      const e = /abc/;
      const a = () => {
        throw new SomeErrorClass('abd');
      };
      expect(a).toBe(
        failingTheAssertion(throwingWith(e), {
          withMessage: `The thrown error's message could not be matched by the expected regex (message: "abd")`,
        })
      );
    });

    it('should fail with correct error for e being a string, and a throwing a string that does not contain e', () => {
      const e = Chance().sentence();
      const actualString = Chance().sentence();
      const a = () => {
        throw actualString;
      };
      expect(a).toBe(
        failingTheAssertion(throwingWith(e), {
          withMessage:
            'The thrown string does not contain the expected message',
          withExpectedValue: e,
          withActualValue: actualString,
        })
      );
    });

    it('should fail with correct error for e being a regex, and a throwing a string that does not match e', () => {
      const e = /abc/;
      const a = () => {
        throw 'abd';
      };
      expect(a).toBe(
        failingTheAssertion(throwingWith(e), {
          withMessage: `The thrown string could not be matched by the expected regex (string: "abd")`,
        })
      );
    });

    it('should fail with correct error for e not being an error nor a string', () => {
      class SomeErrorClass extends BaseError {}
      const a = () => {
        const throwable = Chance().pickone([
          null,
          undefined,
          Chance().bool(),
          Chance().integer,
        ]);
        throw throwable;
      };
      expect(a).toBe(
        failingTheAssertion(throwingWith(SomeErrorClass), {
          withMessage:
            'The thrown value was not an Error instance nor a string',
        })
      );
    });
  });

  describe.only('expect(a).toBe(eventually(assertionOverA))', () => {
    it('should pass if the assertion was fulfilled within 1500ms', async () => {
      const actual = { pass: false };
      setTimeout(() => (actual.pass = true), 1450);
      await expect(actual).toBe(eventually(withProperty('pass', true)));
    });

    it('should pass if the assertion was fulfilled within the value set in <timeout>', async () => {
      const timeout = Chance().integer({ min: 1600, max: 2500 });
      const actual = { pass: false };
      setTimeout(() => (actual.pass = true), timeout - 100);
      await expect(actual).toBe(
        eventually(withProperty('pass', true), { timeout })
      );
    });

    it('should poll in intervals of 50ms by default', async () => {
      const actual = {
        _pass: false,
        _checks: 0,
        get pass() {
          this._checks += 1;
          return this._pass;
        },
      };

      setTimeout(() => (actual._pass = true), 1450);
      await expect(actual).toBe(eventually(withProperty('pass', true)));
      expect(actual._checks).toBe(between(56, 60)); // every "withProperty" should access the value twice
    });

    it('should poll in intervals defined by <interval>, if passed', async () => {
      const actual = {
        _pass: false,
        _checks: 0,
        get pass() {
          this._checks += 1;
          return this._pass;
        },
      };

      setTimeout(() => (actual._pass = true), 1350);
      await expect(actual).toBe(
        eventually(withProperty('pass', true), { interval: 100 })
      );
      expect(actual._checks).toBe(between(28, 30)); // every "withProperty" should access the value twice
    });

    it('should fail if the assertion was not fulfilled within 1500ms', async () => {
      const actual = { pass: false };
      setTimeout(() => (actual.pass = true), 1550);
      await expect(actual).not.toBe(eventually(withProperty('pass', true)));
    });

    it('should fail if the assertion was not fulfilled within the custom <timeout> value', async () => {
      const actual = { pass: false };
      setTimeout(() => (actual.pass = true), 400);
      await expect(actual).not.toBe(
        eventually(withProperty('pass', true), { timeout: 300 })
      );
    });

    it('should fail with the correct error for the assertion not being fulfilled within the default 1500ms', async () => {
      const actual = { pass: false };
      setTimeout(() => (actual.pass = true), 1550);
      await expect(actual).toBe(
        failingTheAssertion(eventually(withProperty('pass', true)), {
          withMessage: `Expectation was not fulfilled within 1500ms`,
        })
      );
    });

    it('should fail with the correct error for the assertion not being fulfilled within the custom <timeout> parameter', async () => {
      const timeout = Chance().integer({ min: 1600, max: 2500 });
      const actual = { pass: false };
      setTimeout(() => (actual.pass = true), timeout + 50);
      await expect(actual).toBe(
        failingTheAssertion(
          eventually(withProperty('pass', true), { timeout }),
          {
            withMessage: `Expectation was not fulfilled within ${timeout}ms`,
          }
        )
      );
    });

    it('should fail with the last error that was thrown by the inner assertion', async () => {
      const timeout = Chance().integer({ min: 1600, max: 2500 });
      const actual = { pass: false };
      setTimeout(() => (actual.pass = true), timeout + 50);
      await expect(actual).toBe(
        failingTheAssertion(eventually(withProperty('pass', true)), {
          withMessage: `The object contains a value other than expected at property "pass"`,
        })
      );
    });
  });

  describe('expect(a).toBe(resolved)', () => {
    it('should pass if a is a promise that resolves', async () => {
      const a = Promise.resolve('ok');
      await expect(a).toBe(resolved);
    });

    it('should fail if a is a promise that rejects', async () => {
      const a = Promise.reject('oh noes');
      await expect(a).not.toBe(resolved);
    });

    it('should fail if a is not a promise', async () => {
      const a = aRandomPrimitive();
      await expect(a).not.toBe(resolved);
    });

    it('should fail with the correct error for a being a promise that rejects', async () => {
      const a = Promise.reject('oh noes');
      await expect(a).toBe(
        failingTheAssertion(resolved, {
          withMessage: 'Expected promise to resolve, but it rejected',
        })
      );
    });

    it('should fail with the correct message for a not being a promise', async () => {
      const a = aRandomPrimitive();
      await expect(a).toBe(
        failingTheAssertion(resolved, {
          withMessage: `Given value is not a promise`,
        })
      );
    });
  });

  describe('expect(a).toBe(resolvedWith(e))', () => {
    it('should pass if a is resolved to a value that equals e', async () => {
      const e = aRandomPrimitive();
      const a = Promise.resolve(e);
      await expect(a).toBe(resolvedWith(e));
    });

    it('should pass if a is resolved to a value that deep equals e', async () => {
      const e = { [Chance().word()]: aRandomPrimitive() };
      const a = Promise.resolve({ ...e });
      await expect(a).toBe(resolvedWith(e));
    });

    it('should fail if a is resolved to a value that does not equal or deep equal e', async () => {
      const e = 'hello';
      const a = Promise.resolve(aRandomPrimitive());
      await expect(a).not.toBe(resolvedWith(e));
    });

    it('should fail if a is rejected', async () => {
      const e = aRandomPrimitive();
      const a = Promise.reject('dang');
      await expect(a).not.toBe(resolvedWith(e));
    });

    it('should fail if a is not a promise', async () => {
      const e = aRandomPrimitive();
      const a = aRandomPrimitive();
      await expect(e).not.toBe(resolvedWith(e));
    });

    it('should fail with the correct error for a being resolved to a value that does not equal or deep equal e', async () => {
      const e = 'yoyo';
      const r = aRandomPrimitive();
      const a = Promise.resolve(r);
      await expect(a).toBe(
        failingTheAssertion(resolvedWith(e), {
          withMessage: 'Promise resolved to a different value than expected',
          withExpectedValue: e,
          withActualValue: r,
        })
      );
    });

    it('should fail with the correct error for a being rejected', async () => {
      const e = aRandomPrimitive();
      const a = Promise.reject('dang');
      await expect(a).toBe(
        failingTheAssertion(resolvedWith(e), {
          withMessage: 'Expected promise to resolve, but it rejected',
        })
      );
    });

    it('should fail with the correct error for a not being a promise', async () => {
      const e = aRandomPrimitive();
      const a = aRandomPrimitive();
      await expect(e).toBe(
        failingTheAssertion(resolvedWith(e), {
          withMessage: `Given value is not a promise`,
        })
      );
    });
  });

  describe('expect(a).toBe(rejected)', () => {
    it('should pass if a is a promise that is rejected', async () => {
      const a = Promise.reject(new Error('rejecting!'));
      await expect(a).toBe(rejected);
    });

    it('should fail if a promise that is fulfilled', async () => {
      const a = Promise.resolve('ok');
      await expect(a).not.toBe(rejected);
    });

    it('should fail if a is not a promise', async () => {
      const a = aRandomPrimitive();
      await expect(a).not.toBe(rejected);
    });

    it('should fail with the correct error for a promise that is not rejecting', async () => {
      const a = Promise.resolve('ok');
      await expect(a).toBe(
        failingTheAssertion(rejected, {
          withMessage: `Expected promise to reject, but it didn't`,
        })
      );
    });

    it('should fail with the correct error for a not being a promise', async () => {
      const a = aRandomPrimitive();
      await expect(a).toBe(
        failingTheAssertion(rejected, {
          withMessage: `Given value is not a promise`,
        })
      );
    });
  });

  describe('expect(a).toBe(rejectedWith(e))', () => {
    it("should pass if e is an Error instance and a rejects with an error that matches e's message", async () => {
      class SomeErrorClass extends BaseError {}
      const message = Chance().sentence();
      const e = new SomeErrorClass(message);
      const a = Promise.reject(new SomeErrorClass(message));
      await expect(a).toBe(rejectedWith(e));
    });

    it('should pass if e is an Error class and a rejects with an error that is an instance of e', async () => {
      class SomeErrorClass extends BaseError {}
      const a = Promise.reject(new SomeErrorClass(Chance().string()));
      await expect(a).toBe(rejectedWith(SomeErrorClass));
    });

    it('should pass if e is a string, and a rejects with an error with a message that contains e', async () => {
      class SomeErrorClass extends BaseError {}
      const e = Chance().sentence();
      const a = Promise.reject(
        new SomeErrorClass(`${Chance().string()}${e}${Chance().string()}`)
      );
      await expect(a).toBe(rejectedWith(e));
    });

    it('should pass if e is a string, and a rejects with a string that contains e', async () => {
      const e = Chance().sentence();
      const a = Promise.reject(`${Chance().string()}${e}${Chance().string()}`);
      await expect(a).toBe(rejectedWith(e));
    });

    it('should pass if e is a regex, and a rejects with an error with a message that matches e', async () => {
      class SomeErrorClass extends BaseError {}
      const e = /abc/;
      const a = Promise.reject(new SomeErrorClass('abc'));
      await expect(a).toBe(rejectedWith(e));
    });

    it('should pass if e is a regex, and a rejects with a string that matches e', async () => {
      const e = /abc/;
      const a = Promise.reject('abc');
      await expect(a).toBe(rejectedWith(e));
    });

    it('should fail if e is an Error instance and a rejects with an error with a different message', async () => {
      class SomeErrorClass extends BaseError {}
      const message = Chance().sentence();
      const e = new SomeErrorClass(message);
      const a = Promise.reject(new SomeErrorClass(Chance().sentence()));
      await expect(a).not.toBe(rejectedWith(e));
    });

    it('should fail if e is an Error class and a rejects with an error that is not an instance of e', async () => {
      class SomeErrorClass extends BaseError {}
      class AnotherErrorClass extends BaseError {}
      const a = Promise.resolve(new AnotherErrorClass(Chance().string()));
      await expect(a).not.toBe(rejectedWith(SomeErrorClass));
    });

    it('should fail if e is a string, and a rejects with an error with a message that does not contain e', async () => {
      class SomeErrorClass extends BaseError {}
      const e = Chance().sentence();
      const a = Promise.reject(new SomeErrorClass(`${Chance().string()}`));
      await expect(a).not.toBe(rejectedWith(e));
    });

    it('should fail if e is a regex, and a rejects with an error with a message that does not match e', async () => {
      class SomeErrorClass extends BaseError {}
      const e = /abc/;
      const a = Promise.reject(new SomeErrorClass('abd'));
      await expect(a).not.toBe(rejectedWith(e));
    });

    it('should fail if e is a string, and a rejects with a string that does not contain e', async () => {
      const e = Chance().sentence();
      const a = Promise.reject(`${Chance().string()}`);
      await expect(a).not.toBe(rejectedWith(e));
    });

    it('should fail if e is a regex, and a rejects with a string that does not match e', async () => {
      const e = /abc/;
      const a = Promise.reject('abd');
      await expect(a).not.toBe(rejectedWith(e));
    });

    it('should fail if a rejects with a value that is not an error nor a string', async () => {
      const a = Promise.reject(
        Chance().pickone([null, undefined, Chance().bool(), Chance().integer])
      );
      await expect(a).not.toBe(rejectedWith(Error));
    });

    it('should fail if a resolves', async () => {
      const a = Promise.resolve();
      await expect(a).not.toBe(rejectedWith(Error));
    });

    it('should fail if a is not a promise', async () => {
      const a = aRandomPrimitive();
      await expect(a).not.toBe(rejectedWith(Error));
    });

    it('should fail with correct error for e being an Error instance and a rejecting with an error with a different message', async () => {
      class SomeErrorClass extends BaseError {}
      const message = Chance().sentence();
      const e = new SomeErrorClass(message);
      const actualError = new SomeErrorClass(Chance().sentence());
      const a = Promise.reject(actualError);
      await expect(a).toBe(
        failingTheAssertion(rejectedWith(e), {
          withMessage: 'The thrown error is different than expected',
          withExpectedValue: e,
          withActualValue: actualError,
        })
      );
    });

    it('should fail with correct error for e being an Error class and a rejecting with an error that is not an instance of e', async () => {
      class SomeErrorClass extends BaseError {}
      class AnotherErrorClass extends BaseError {}
      const a = Promise.reject(new AnotherErrorClass(Chance().string()));
      await expect(a).toBe(
        failingTheAssertion(rejectedWith(SomeErrorClass), {
          withMessage: 'The thrown error is not an instance of SomeErrorClass',
        })
      );
    });

    it('should fail with correct error for e being a string, and a rejecting with an error with a message that does not contain e', async () => {
      class SomeErrorClass extends BaseError {}
      const e = Chance().sentence();
      const actualMessage = Chance().string();
      const a = Promise.reject(new SomeErrorClass(actualMessage));
      await expect(a).toBe(
        failingTheAssertion(rejectedWith(e), {
          withMessage: `The thrown error does not contain the expected message`,
          withExpectedValue: e,
          withActualValue: actualMessage,
        })
      );
    });

    it('should fail with correct error for e being a regex, and a rejecting with an error with a message that does not match e', async () => {
      class SomeErrorClass extends BaseError {}
      const e = /abc/;
      const a = Promise.reject(new SomeErrorClass('abd'));
      await expect(a).toBe(
        failingTheAssertion(rejectedWith(e), {
          withMessage: `The thrown error's message could not be matched by the expected regex (message: "abd")`,
        })
      );
    });

    it('should fail with correct error for e being a string, and a rejecting with a string that does not contain e', async () => {
      const e = Chance().sentence();
      const actualString = Chance().sentence();
      const a = Promise.reject(actualString);
      await expect(a).toBe(
        failingTheAssertion(rejectedWith(e), {
          withMessage:
            'The thrown string does not contain the expected message',
          withExpectedValue: e,
          withActualValue: actualString,
        })
      );
    });

    it('should fail with correct error for e being a regex, and a rejecting with a string that does not match e', async () => {
      const e = /abc/;
      const a = Promise.reject('abd');
      await expect(a).toBe(
        failingTheAssertion(rejectedWith(e), {
          withMessage: `The thrown string could not be matched by the expected regex (string: "abd")`,
        })
      );
    });

    it('should fail with correct error for a rejecting with a value that is not an error nor a string', async () => {
      class SomeErrorClass extends BaseError {}
      const a = Promise.reject(
        Chance().pickone([null, undefined, Chance().bool(), Chance().integer])
      );
      await expect(a).toBe(
        failingTheAssertion(rejectedWith(SomeErrorClass), {
          withMessage:
            'The thrown value was not an Error instance nor a string',
        })
      );
    });

    it('should fail with the correct error for a promise that is not rejecting', async () => {
      const a = Promise.resolve('ok');
      await expect(a).toBe(
        failingTheAssertion(rejectedWith(Error), {
          withMessage: `Expected promise to reject, but it didn't`,
        })
      );
    });

    it('should fail with the correct error for a not being a promise', async () => {
      const a = aRandomPrimitive();
      await expect(a).toBe(
        failingTheAssertion(rejectedWith(Error), {
          withMessage: `Given value is not a promise`,
        })
      );
    });
  });
});
