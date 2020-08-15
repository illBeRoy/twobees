import { Chance } from 'chance';
import { aRandomPrimitive, aRandomArray, aValueThatIs } from '../utils/values';
import { failingTheMatcher } from '../utils/matchers';
import { expect, sameAs, equal, withLength, withProperty } from '../../src';

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
});
