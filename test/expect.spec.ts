import { Chance } from 'chance';
import diff from 'jest-diff';
import indentString from 'indent-string';
import { expect as $expect } from '../src';

describe('the expect function', () => {
  describe('when given a predicate and an actual value', () => {
    it('should pass the actual value into the predicate', () => {
      const someValue = Chance().string();
      const spiedUpon = jest.fn().mockReturnValue(true);

      $expect(someValue).toBe(spiedUpon);

      expect(spiedUpon).toHaveBeenCalledWith(someValue);
    });
  });

  describe('when the predicate returns a boolean value', () => {
    it('should not throw if the predicate returns true', () => {
      const discardedAsIAlwaysReturnTrue = () => true;
      expect(() =>
        $expect({}).toBe(discardedAsIAlwaysReturnTrue)
      ).not.toThrow();
    });

    it('should throw if the predicate returns false', () => {
      const discardedAsIAlwaysReturnFalse = () => false;
      expect(() => $expect({}).toBe(discardedAsIAlwaysReturnFalse)).toThrow(
        'Expectation failed'
      );
    });
  });

  describe('when the predicate returns a string value', () => {
    it('should treat it as an error message', () => {
      const errorMessage = `failed because of ${Chance().name()}`;
      const failedWithErrorMessage = () => errorMessage;

      expect(() => $expect({}).toBe(failedWithErrorMessage)).toThrow(
        errorMessage
      );
    });
  });

  describe('when the predicate returns a detailed result of [message, expected, actual]', () => {
    it('should format the error message', () => {
      const errorMessage = `failed because of ${Chance().name()}`;
      const expected = Chance().string();
      const actual = Chance().string();
      const failedWithDetailedResult = () => [errorMessage, expected, actual];

      expect(() => $expect({}).toBe(failedWithDetailedResult)).toThrow(
        errorMessage
      );
    });

    it('should format the diff using jest-diff', () => {
      const errorMessage = `failed because of ${Chance().name()}`;
      const expected = Chance().string();
      const actual = Chance().string();
      const failedWithDetailedResult = () => [errorMessage, expected, actual];

      expect(() => $expect({}).toBe(failedWithDetailedResult)).toThrow(
        indentString(diff(expected, actual), 4)
      );
    });
  });

  describe('when the predicate is async', () => {
    describe('and resolves a boolean value', () => {
      it('should resolve if the predicate returns true', async () => {
        const discardedAsIAlwaysReturnTrue = async () => true;
        await expect(
          $expect({}).toBe(discardedAsIAlwaysReturnTrue)
        ).resolves.toBeFalsy();
      });

      it('should reject the predicate returns false', async () => {
        const discardedAsIAlwaysReturnFalse = async () => false;
        await expect(
          $expect({}).toBe(discardedAsIAlwaysReturnFalse)
        ).rejects.toThrow('Expectation failed');
      });
    });

    describe('and resolves to a string value', () => {
      it('should reject with the string as an error message', async () => {
        const errorMessage = `failed because of ${Chance().name()}`;
        const failedWithErrorMessage = async () => errorMessage;

        await expect($expect({}).toBe(failedWithErrorMessage)).rejects.toThrow(
          errorMessage
        );
      });
    });

    describe('and resolves to a detailed result of [message, expected, actual]', () => {
      it('should reject with the diff between expected and actual using jest-diff', async () => {
        const errorMessage = `failed because of ${Chance().name()}`;
        const expected = Chance().string();
        const actual = Chance().string();
        const failedWithDetailedResult = async () => [
          errorMessage,
          expected,
          actual,
        ];

        await expect(
          $expect({}).toBe(failedWithDetailedResult)
        ).rejects.toThrow(indentString(diff(expected, actual), 4));
      });
    });

    describe('and rejects for any reason', () => {
      it('should reject as well', async () => {
        const rejectByThePredicate = async () => {
          throw new Error('Rejecting tho');
        };

        await expect($expect({}).toBe(rejectByThePredicate)).rejects.toThrow();
      });
    });
  });

  describe('when negating the condition using the .not directive', () => {
    it('should throw if the predicate returns true', () => {
      const discardedAsIAlwaysReturnTrue = () => true;
      expect(() => $expect({}).not.toBe(discardedAsIAlwaysReturnTrue)).toThrow(
        'Expected to fail, but the assertion passed!'
      );
    });

    it('should succeed if the predicate returns false', () => {
      const discardedAsIAlwaysReturnFalse = () => false;
      expect(() =>
        $expect({}).not.toBe(discardedAsIAlwaysReturnFalse)
      ).not.toThrow();
    });

    it('should succeed if the predicate returns string value', () => {
      const failedWithErrorMessage = () => Chance().string();
      expect(() => $expect({}).not.toBe(failedWithErrorMessage)).not.toThrow();
    });

    it('should succeed if the predicate returns detailed result of [message, expected, actual]', () => {
      const failedWithDetailedResult = () => [
        Chance().string(),
        Chance().string(),
        Chance().string(),
      ];

      expect(() =>
        $expect({}).not.toBe(failedWithDetailedResult)
      ).not.toThrow();
    });

    it('should reject if given async predicate that returned true', async () => {
      const discardedAsIAlwaysReturnTrue = async () => true;
      await expect(
        $expect({}).not.toBe(discardedAsIAlwaysReturnTrue)
      ).rejects.toThrow('Expected to fail, but the assertion passed!');
    });

    it('should resolve if given async predicate that returned false', async () => {
      const discardedAsIAlwaysReturnFalse = async () => false;
      await expect(
        $expect({}).not.toBe(discardedAsIAlwaysReturnFalse)
      ).resolves.toBeFalsy();
    });

    it('should resolve if given async predicate that returned string', async () => {
      const errorMessage = `failed because of ${Chance().name()}`;
      const failedWithErrorMessage = async () => errorMessage;

      await expect(
        $expect({}).not.toBe(failedWithErrorMessage)
      ).resolves.toBeFalsy();
    });

    it('should resolve if given async predicate that returned detailed result of [message, expected, actual]', async () => {
      const errorMessage = `failed because of ${Chance().name()}`;
      const expected = Chance().string();
      const actual = Chance().string();
      const failedWithDetailedResult = async () => [
        errorMessage,
        expected,
        actual,
      ];

      await expect(
        $expect({}).not.toBe(failedWithDetailedResult)
      ).resolves.toBeFalsy();
    });
  });

  describe('when expecting one of multiple expectations to pass using .either directive', () => {
    it('should pass (and not throw) if at least one of the expectations have passed', () => {
      const passingPredicate = () => true;
      const failingWithBoolPredicate = () => false;
      const failingWithMessagePredicate = () => `i'm ded`;
      const failingWithDiffPredicate = () => [`im srsly ded`, true, false];
      expect(() =>
        $expect({}).toBeEither(
          passingPredicate,
          failingWithBoolPredicate,
          failingWithMessagePredicate,
          failingWithDiffPredicate
        )
      ).not.toThrow();
    });

    it('should not pass (and throw) if non of the expectations have passed', () => {
      const failingWithBoolPredicate = () => false;
      const failingWithMessagePredicate = () => `i'm ded`;
      const failingWithDiffPredicate = () => [`im srsly ded`, true, false];
      expect(() =>
        $expect({}).toBeEither(
          failingWithBoolPredicate,
          failingWithMessagePredicate,
          failingWithDiffPredicate
        )
      ).toThrow('None of the 3 expectations have passed');
    });

    it('should return a promise if at least one of the predicates is a promise, and resolve if at least one predicate has passed', async () => {
      const passingPredicate = async () => true;
      const failingWithBoolPredicate = () => false;
      const failingWithMessagePredicate = async () => `i'm ded`;
      const failingWithDiffPredicate = () => [`im srsly ded`, true, false];
      await expect(
        $expect({}).toBeEither(
          passingPredicate,
          failingWithBoolPredicate,
          failingWithMessagePredicate,
          failingWithDiffPredicate
        )
      ).resolves.toBeUndefined();
    });

    it('should return a promise if at least one of the predicates is a promise, and reject if non of the predicates has passed', async () => {
      const failingWithBoolPredicate = () => false;
      const failingWithMessagePredicate = async () => `i'm ded`;
      const failingWithDiffPredicate = () => [`im srsly ded`, true, false];
      await expect(
        $expect({}).toBeEither(
          failingWithBoolPredicate,
          failingWithMessagePredicate,
          failingWithDiffPredicate
        )
      ).rejects.toThrow('None of the 3 expectations have passed');
    });
  });

  describe('when the predicate does not return any of the agreed upon types of values', () => {
    it('should throw if the predicate is not async', () => {
      const unacceptableReturnValue = Chance().pickone([
        null,
        undefined,
        [],
        {},
      ]);

      const checkedWithUnacceptablePredicate = () => unacceptableReturnValue;

      //@ts-expect-error
      expect(() => $expect({}).toBe(checkedWithUnacceptablePredicate)).toThrow(
        `Internal Error: The predicate returned an unknown value: ${unacceptableReturnValue}. Please check its implementation and read the twobees FAQ if needed`
      );
    });
  });
});

describe('composition of matchers - the ability to build matchers on top of other matchers', () => {
  describe('when using "expect" from within a matcher', () => {
    it('should pass if all internal matchers have passed', () => {
      const internalMatcher1 = (actual) => true;
      const internalMatcher2 = (actual) => true;
      const compositeMatcher = (actual) => {
        $expect(actual).toBe(internalMatcher1);
        $expect(actual).toBe(internalMatcher2);
        return true;
      };

      expect(() => $expect({}).toBe(compositeMatcher)).not.toThrow();
    });

    it('should propagate an assertion error that was thrown from on of the internal expects', () => {
      const internalMatcher1 = (actual) => true;
      const internalMatcher2 = (actual) => false;
      const compositeMatcher = (actual) => {
        $expect(actual).toBe(internalMatcher1);
        $expect(actual).toBe(internalMatcher2);
        return true;
      };
      expect(() => $expect({}).toBe(compositeMatcher)).toThrow(
        'Expectation failed'
      );
    });

    it('should handle "either" statements correctly', () => {
      const internalMatcher1 = (actual) => true;
      const internalMatcher2 = (actual) => false;
      const compositeMatcher = (actual) => {
        $expect(actual).toBeEither(internalMatcher1, internalMatcher2);
        return true;
      };

      expect(() => $expect({}).toBe(compositeMatcher)).not.toThrow();
    });
  });
});
