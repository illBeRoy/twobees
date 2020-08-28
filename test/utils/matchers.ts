import deepEqual from 'fast-deep-equal';
import { MatcherFn } from '../../src';
import { isPromise } from '../../src/promise';

const ValueNotPassed = Symbol();

export const failingTheMatcher = <T, TMatcher extends MatcherFn<T>>(
  matcher: TMatcher,
  {
    withMessage = '',
    withActualValue = ValueNotPassed as unknown,
    withExpectedValue = ValueNotPassed as unknown,
  } = {}
) => (actual: T) => {
  const resOrPromise = matcher(actual);

  const handleResult = (res: unknown) => {
    if (res === true) {
      return 'Expected matcher to fail, but it passed';
    }

    const errorMessage: string =
      res === false
        ? ''
        : typeof res === 'string'
        ? res
        : res instanceof Array && res.length === 3
        ? (res[0] as string)
        : null;

    const expectedValue =
      res instanceof Array && res.length === 3 ? res[1] : undefined;

    const actualValue =
      res instanceof Array && res.length === 3 ? res[2] : undefined;

    if (errorMessage === null) {
      return 'Matcher did not return a valid result!';
    }

    if (!errorMessage.includes(withMessage)) {
      return [
        'Matcher did fail, but did not include the expected error message',
        withMessage,
        errorMessage,
      ];
    }

    if (
      withExpectedValue !== ValueNotPassed &&
      !deepEqual(withExpectedValue, expectedValue)
    ) {
      return [
        'The "expected" value that was returned by the failing matcher is different than expected',
        withExpectedValue,
        expectedValue,
      ];
    }

    if (
      withActualValue !== ValueNotPassed &&
      !deepEqual(withActualValue, actualValue)
    ) {
      return [
        'The "actual" value that was returned by the failing matcher is different than expected',
        withActualValue,
        actual,
      ];
    }

    return true;
  };

  if (isPromise(resOrPromise)) {
    return resOrPromise.then(handleResult);
  } else {
    return handleResult(resOrPromise);
  }
};
