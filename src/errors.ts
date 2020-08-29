import diff from 'jest-diff';
import indentString from 'indent-string';

export class BaseError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface ExpectationFailureOpts {
  message?: string;
  expectedActualPair?: [unknown, unknown];
}

export class ExpectationFailureError extends BaseError {
  public readonly expectationMessage: string;
  public readonly expected: unknown;
  public readonly actual: unknown;

  constructor({ message, expectedActualPair }: ExpectationFailureOpts = {}) {
    super(
      `Expectation failed` +
        (message ? `:\n${indentString(message, 2)}` : '') +
        (expectedActualPair
          ? `\n${indentString(
              diff(expectedActualPair[0], expectedActualPair[1]),
              4
            )}`
          : '')
    );
    this.expectationMessage = message;
    this.expected = expectedActualPair?.[0];
    this.actual = expectedActualPair?.[1];
  }
}
