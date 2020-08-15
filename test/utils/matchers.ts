import { MatcherFn } from '../../src';

const ValueNotPassed = Symbol();

export const failingTheMatcher = <T, TMatcher extends MatcherFn<T>>(
  matcher: TMatcher,
  {
    withMessage = '',
    withActualValue = ValueNotPassed as any,
    withExpectedValue = ValueNotPassed as any,
  } = {}
) => (actual: T) => {
  const res = matcher(actual);

  if (res === true) {
    return 'Expected matcher to fail, but it passed';
  }

  const errorMessage: string =
    res === false
      ? ''
      : typeof res === 'string'
      ? res
      : res instanceof Array && res.length === 3
      ? res[0]
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
      'Matcher failure did not include the expected error message',
      withMessage,
      errorMessage,
    ];
  }

  if (
    withExpectedValue !== ValueNotPassed &&
    withExpectedValue !== expectedValue
  ) {
    return [
      'The "expected" value that was returned by the matcher is different than expected',
      withExpectedValue,
      expectedValue,
    ];
  }

  if (withActualValue !== ValueNotPassed && withActualValue !== actualValue) {
    return [
      'The "actual" value that was returned by the matcher is different than expected',
      withActualValue,
      actual,
    ];
  }

  return true;
};
