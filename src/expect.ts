import { ExpectationFailureError } from './errors';
import { isPromise } from './promise';

export type Expected = unknown;
export type Actual = unknown;
export type MatcherDetailedResult = [string, Expected, Actual] | unknown[];

export type MatcherFn<T> = (
  value: T
) =>
  | boolean
  | string
  | MatcherDetailedResult
  | Promise<boolean | string | MatcherDetailedResult>;

export type ToBeReturnValue<TMatcherFn extends MatcherFn<unknown>> = ReturnType<
  TMatcherFn
> extends Promise<unknown>
  ? Promise<void>
  : void;

export type ToBeEitherReturnValue<
  TMatcherFns extends MatcherFn<unknown>[]
> = Promise<unknown> extends ReturnType<TMatcherFns[number]>
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
        throw new ExpectationFailureError();
      }

      if (typeof res === 'string') {
        throw new ExpectationFailureError({
          message: res,
        });
      }

      if (res instanceof Array && res.length === 3) {
        const [message, expected, actual] = res;
        throw new ExpectationFailureError({
          message,
          expectedActualPair: [expected, actual],
        });
      }

      throw new Error(
        `Internal Error: The predicate returned an unknown value: ${res}. Please check its implementation and read the twobees FAQ if needed`
      );
    };

    const resOfMatcher = matcher(value);

    if (isPromise(resOfMatcher)) {
      //@ts-expect-error
      return Promise.resolve()
        .then(() => resOfMatcher)
        .then((res) => handleResult(res));
    } else {
      handleResult(resOfMatcher);
    }
  };

  const not = {
    toBe: <TMatcherFn extends MatcherFn<unknown>>(
      matcher: TMatcherFn
    ): ToBeReturnValue<TMatcherFn> => {
      const handleResultOfToBe = (result) => {
        if (result === true) {
          throw new Error('Expected to fail, but the assertion passed!');
        }
      };

      const resOfMatcher = matcher(value);

      if (isPromise(resOfMatcher)) {
        //@ts-expect-error
        return Promise.resolve()
          .then(() => resOfMatcher)
          .then(handleResultOfToBe);
      } else {
        handleResultOfToBe(resOfMatcher);
      }
    },
  };

  const toBeEither = <TMatcherFns extends MatcherFn<TValue>[]>(
    ...matchers: TMatcherFns
  ): ToBeEitherReturnValue<TMatcherFns> => {
    const asyncMatcherResults: Promise<unknown>[] = [];
    let hasAnySyncMatcherPassed = false;
    for (const matcher of matchers) {
      try {
        const res: unknown = toBe(matcher);
        if (isPromise(res)) {
          asyncMatcherResults.push(res);
        } else {
          hasAnySyncMatcherPassed = true;
        }
      } catch (err) {
        continue;
      }
    }

    if (hasAnySyncMatcherPassed) {
      Promise.all(asyncMatcherResults).catch(() => void 0);
      return;
    }

    if (asyncMatcherResults.length > 0) {
      //@ts-expect-error
      return Promise.all(
        asyncMatcherResults.map<Promise<'ok' | 'failed'>>((matcherRes) =>
          matcherRes.then(() => 'ok' as const).catch(() => 'failed' as const)
        )
      ).then((results) => {
        if (results.some((result) => result === 'ok')) {
          return;
        } else {
          throw new ExpectationFailureError({
            message: `None of the ${matchers.length} expectations have passed`,
          });
        }
      });
    }

    throw new ExpectationFailureError({
      message: `None of the ${matchers.length} expectations have passed`,
    });
  };

  return {
    toBe,
    not,
    toBeEither,
  };
};
