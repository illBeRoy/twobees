export class BaseError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ExpectationFailureError extends BaseError {}
