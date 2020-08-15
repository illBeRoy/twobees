import diff from 'jest-diff';
import indentString from 'indent-string';

export type Expected = any;
export type Actual = any;
export type MatcherDetailedResult = [string, Expected, Actual] | any[];

export type MatcherFn<T> = (
  value: T
) =>
  | boolean
  | string
  | MatcherDetailedResult
  | Promise<boolean | string | MatcherDetailedResult>;

export type ToBeReturnValue<TMatcherFn extends MatcherFn<any>> = ReturnType<
  TMatcherFn
> extends Promise<any>
  ? Promise<void>
  : void;

export const expect = <TValue>(value: TValue) => {
  const toBe = <TMatcherFn extends MatcherFn<TValue>>(
    matcher: TMatcherFn
  ): ToBeReturnValue<TMatcherFn> => {
    const handleResult = (res) => {
      if (res === true) {
        return;
      }

      if (res === false) {
        throw new Error('Expectation failed');
      }

      if (typeof res === 'string') {
        throw new Error(`Expectation failed:\n${indentString(res, 2)}`);
      }

      if (res instanceof Array && res.length === 3) {
        const [message, expected, actual] = res;
        throw new Error(
          `Expectation failed:\n${indentString(message, 2)}\n${indentString(
            diff(expected, actual),
            4
          )}`
        );
      }

      throw new Error(
        `Internal Error: The predicate returned an unknown value: ${res}. Please check its implementation and read the twobees FAQ if needed`
      );
    };

    const resOfMatcher = matcher(value);

    if (isPromise(resOfMatcher)) {
      return Promise.resolve()
        .then(() => resOfMatcher)
        .then((res) => handleResult(res)) as any;
    } else {
      handleResult(resOfMatcher);
    }
  };

  const not = {
    toBe: <TMatcherFn extends MatcherFn<any>>(
      matcher: TMatcherFn
    ): ToBeReturnValue<TMatcherFn> => {
      const handleResultOfToBe = (result) => {
        if (result === true) {
          throw new Error('Expected to fail, but the assertion passed!');
        }
      };

      const resOfMatcher = matcher(value);

      if (isPromise(resOfMatcher)) {
        return Promise.resolve()
          .then(() => resOfMatcher)
          .then(handleResultOfToBe) as any;
      } else {
        handleResultOfToBe(resOfMatcher);
      }
    },
  };

  const isPromise = (val) =>
    val && typeof val === 'object' && 'then' in val && 'catch' in val;

  return {
    toBe,
    not,
  };
};
