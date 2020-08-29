import { ExpectationFailureError } from './errors';
import { isPromise } from './promise';

export type Expected = unknown;
export type Actual = unknown;
export type AssertionDetailedResult = [string, Expected, Actual] | unknown[];

export type AssertionFn<T> = (
  value: T
) =>
  | boolean
  | string
  | AssertionDetailedResult
  | Promise<boolean | string | AssertionDetailedResult>;

export type ToBeReturnValue<
  TAssertionFn extends AssertionFn<unknown>
> = ReturnType<TAssertionFn> extends Promise<unknown> ? Promise<void> : void;

export type ToBeEitherReturnValue<
  TAssertionFns extends AssertionFn<unknown>[]
> = Promise<unknown> extends ReturnType<TAssertionFns[number]>
  ? Promise<void>
  : void;

export const expect = <TValue>(value: TValue) => {
  const toBe = <TAssertionFn extends AssertionFn<TValue>>(
    assertion: TAssertionFn
  ): ToBeReturnValue<TAssertionFn> => {
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

    const resOfAssertion = assertion(value);

    if (isPromise(resOfAssertion)) {
      //@ts-expect-error
      return Promise.resolve()
        .then(() => resOfAssertion)
        .then((res) => handleResult(res));
    } else {
      handleResult(resOfAssertion);
    }
  };

  const not = {
    toBe: <TAssertionFn extends AssertionFn<unknown>>(
      assertion: TAssertionFn
    ): ToBeReturnValue<TAssertionFn> => {
      const handleError = (err: unknown) => {
        if (err instanceof ExpectationFailureError) {
          return;
        } else {
          throw err;
        }
      };

      let resOrPromise: unknown;
      try {
        resOrPromise = expect(value).toBe(assertion);
      } catch (err) {
        handleError(err);
        return;
      }

      if (isPromise(resOrPromise)) {
        let wasHandled = false;
        //@ts-expect-error
        return resOrPromise
          .then(() => {
            wasHandled = true;
            throw new ExpectationFailureError({
              message: 'Expected to fail, but the assertion passed!',
            });
          })
          .catch((err) => {
            if (!wasHandled) {
              handleError(err);
            } else {
              throw err;
            }
          });
      } else {
        throw new ExpectationFailureError({
          message: 'Expected to fail, but the assertion passed!',
        });
      }
    },
  };

  const toBeEither = <TAssertionFns extends AssertionFn<TValue>[]>(
    ...assertions: TAssertionFns
  ): ToBeEitherReturnValue<TAssertionFns> => {
    const asyncAssertionResults: Promise<unknown>[] = [];
    let hasAnySyncAssertionPassed = false;
    for (const assertion of assertions) {
      try {
        const res: unknown = toBe(assertion);
        if (isPromise(res)) {
          asyncAssertionResults.push(res);
        } else {
          hasAnySyncAssertionPassed = true;
        }
      } catch (err) {
        continue;
      }
    }

    if (hasAnySyncAssertionPassed) {
      Promise.all(asyncAssertionResults).catch(() => void 0);
      return;
    }

    if (asyncAssertionResults.length > 0) {
      //@ts-expect-error
      return Promise.all(
        asyncAssertionResults.map<Promise<'ok' | 'failed'>>((assertionRes) =>
          assertionRes.then(() => 'ok' as const).catch(() => 'failed' as const)
        )
      ).then((results) => {
        if (results.some((result) => result === 'ok')) {
          return;
        } else {
          throw new ExpectationFailureError({
            message: `None of the ${assertions.length} expectations have passed`,
          });
        }
      });
    }

    throw new ExpectationFailureError({
      message: `None of the ${assertions.length} expectations have passed`,
    });
  };

  return {
    toBe,
    not,
    toBeEither,
  };
};
