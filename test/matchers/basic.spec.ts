import { aRandomPrimitive } from '../builders/primitive';
import { expect, sameAs, equal } from '../../src';

describe('basic matchers', () => {
  describe('expect(a).toBe(sameAs(e))', () => {
    it('should pass if a === e', () => {
      const val = aRandomPrimitive();
      expect(val).toBe(sameAs(val));
    });

    it('should fail if a !== e', () => {
      const a = aRandomPrimitive();
      const b = aRandomPrimitive();
      expect(a).not.toBe(sameAs(b));
    });

    it('should fail even if a and e are objects with the same members, as this is not a deep equality', () => {
      const a = { someKey: 'someValue' };
      const b = { someKey: 'someValue' };
      expect(a).not.toBe(sameAs(b));
    });
  });

  describe('expect(a).toBe(equal(e))', () => {
    it('should pass if a === e', () => {
      const val = aRandomPrimitive();
      expect(val).toBe(equal(val));
    });

    it('should pass if a deep equals e', () => {
      const a = { someKey: 'someValue' };
      const b = { someKey: 'someValue' };
      expect(a).toBe(equal(b));
    });

    it('should fail if a !== e', () => {
      const a = aRandomPrimitive();
      const b = aRandomPrimitive();
      expect(a).not.toBe(equal(b));
    });

    it('should fail if a not deep equals e', () => {
      const a = { someKey: 'someValue' };
      const b = { someKey: 'someOtherValue' };
      expect(a).not.toBe(equal(b));
    });
  });
});
