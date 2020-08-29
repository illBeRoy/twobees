import deepEqual from 'fast-deep-equal';
import { isPromise } from '../../src/promise';
import { ExpectationFailureError } from '../../src/errors';
import { AssertionFn, expect } from '../../src';

const ValueNotPassed = Symbol();

export const failingTheAssertion = <T, TMatcher extends AssertionFn<T>>(
  matcher: TMatcher,
  {
    withMessage = '',
    withActualValue = ValueNotPassed as unknown,
    withExpectedValue = ValueNotPassed as unknown,
  } = {}
) => (actual: T) => {
  const handleResult = (err: Error) => {
    if (!(err instanceof ExpectationFailureError)) {
      throw err;
    }

    if (!err.message?.includes(withMessage)) {
      return [
        'Matcher did fail, but did not include the expected error message',
        withMessage,
        err?.message,
      ];
    }

    if (
      withExpectedValue !== ValueNotPassed &&
      !deepEqual(withExpectedValue, err.expected)
    ) {
      return [
        'The "expected" value that was returned by the failing matcher is different than expected',
        withExpectedValue,
        err.expected,
      ];
    }

    if (
      withActualValue !== ValueNotPassed &&
      !deepEqual(withActualValue, err.actual)
    ) {
      return [
        'The "actual" value that was returned by the failing matcher is different than expected',
        withActualValue,
        actual,
      ];
    }

    return true;
  };

  try {
    const resOrPromise: unknown = expect(actual).toBe(matcher);
    if (isPromise(resOrPromise)) {
      return resOrPromise
        .then(() => 'Expected matcher to fail, but it passed')
        .catch(handleResult);
    } else {
      return 'Expected matcher to fail, but it passed';
    }
  } catch (err) {
    return handleResult(err);
  }
};
