import { Chance } from 'chance';
import { aRandomPrimitive, aRandomArray, aValueThatIs } from '../utils/values';
import { failingTheMatcher } from '../utils/matchers';
import {
  expect,
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
} from '../../src';

describe('basic matchers', () => {
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
        failingTheMatcher(sameAs(e), {
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
        failingTheMatcher(equal(e), {
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
        failingTheMatcher(withLength(e), {
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
        failingTheMatcher(withLength(e), {
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
        failingTheMatcher(withProperty(key), {
          withMessage: `The object does not contain the key "${key}"`,
        })
      );
    });

    it('should fail with correct message for object not containing a key, even if checking value in addition to key', () => {
      const key = Chance().string();
      const value = aRandomPrimitive();
      const a = { [Chance().string()]: Chance().string() };
      expect(a).toBe(
        failingTheMatcher(withProperty(key, value), {
          withMessage: `The object does not contain the key "${key}"`,
        })
      );
    });

    it('should fail with correct message for object that contains a different value than expected', () => {
      const key = Chance().string();
      const value = aRandomPrimitive();
      const a = { [key]: aValueThatIs(aRandomPrimitive, { not: value }) };
      expect(a).toBe(
        failingTheMatcher(withProperty(key, value), {
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
        failingTheMatcher(withProperty(key), {
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
        failingTheMatcher(between(min, max), {
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
        failingTheMatcher(between(min, max), {
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
        failingTheMatcher(defined, {
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
        failingTheMatcher(falsy, {
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
        failingTheMatcher(truthy, {
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
        failingTheMatcher(greaterThan(e), {
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
        failingTheMatcher(greaterThan(e), {
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
        failingTheMatcher(greaterThanEqual(e), {
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
        failingTheMatcher(greaterThanEqual(e), {
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
        failingTheMatcher(lessThan(e), {
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
        failingTheMatcher(lessThan(e), {
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
        failingTheMatcher(lessThanEqual(e), {
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
        failingTheMatcher(lessThanEqual(e), {
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
        failingTheMatcher(instanceOf(E), {
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
        failingTheMatcher(aNull, {
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
        failingTheMatcher(anUndefined, {
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
        failingTheMatcher(aNaN, {
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
        failingTheMatcher(havingSameElementsAs(e), {
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
        failingTheMatcher(havingSameElementsAs(e), {
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
        failingTheMatcher(aSupersetOf(e), {
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
        failingTheMatcher(aSupersetOf(e), {
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
        failingTheMatcher(aSubsetOf(e), {
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
        failingTheMatcher(aSubsetOf(e), {
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
        failingTheMatcher(matching(e), {
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
        failingTheMatcher(matching(e), {
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
        failingTheMatcher(matching(e), {
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
        failingTheMatcher(throwing, {
          withMessage: `Expected function to throw, but it didn't`,
        })
      );
    });

    it('should fail with the correct error for a not being a function', () => {
      const a = aRandomPrimitive();
      expect(a).toBe(
        failingTheMatcher(throwing, {
          withMessage: `Given value is not a function`,
        })
      );
    });
  });
});
