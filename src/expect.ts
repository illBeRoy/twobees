import { ExpectationFailureError } from './errors';

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

export type ToBeEitherReturnValue<
  TMatcherFns extends MatcherFn<any>[]
> = Promise<any> extends ReturnType<TMatcherFns[number]> ? Promise<void> : void;

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

  const toBeEither = <TMatcherFns extends MatcherFn<TValue>[]>(
    ...matchers: TMatcherFns
  ): ToBeEitherReturnValue<TMatcherFns> => {
    const asyncMatcherResults: Promise<void>[] = [];
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
      }) as any;
    }

    throw new ExpectationFailureError({
      message: `None of the ${matchers.length} expectations have passed`,
    });
  };

  const isPromise = (val): val is Promise<any> =>
    val && typeof val === 'object' && 'then' in val && 'catch' in val;

  return {
    toBe,
    not,
    toBeEither,
  };
};
