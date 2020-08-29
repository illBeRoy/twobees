# Assertions Library
**twobees** come with a variety of assertion functions. Read all about them here.

* [Basic](#basic)
* [Jest](#jest)

## Basic
The basic, fundamental assertions that you need to cover your tests.
They are included in the main `twobees` package, and you can simply import
them from there:

```js
import { sameAs, equal, ... } from 'twobees';
```

* [`sameAs`](#sameAs)
* [`equal`](#equal)
* [`withLength`](#withLength)
* [`withProperty`](#withProperty)
* [`between`](#between)
* [`defined`](#defined)
* [`falsy`](#falsy)
* [`truthy`](#truthy)
* [`greaterThan`](#greaterThan)
* [`greaterThanEqual`](#greaterThanEqual)
* [`lessThan`](#lessThan)
* [`lessThanEqual`](#lessThanEqual)
* [`instanceOf`](#instanceOf)
* [`aNull`](#aNull)
* [`anUndefined`](#anUndefined)
* [`aNaN`](#aNaN)
* [`havingSameElementsAs`](#havingSameElementsAs)
* [`aSupersetOf`](#aSupersetOf)
* [`aSubsetOf`](#aSubsetOf)
* [`matching`](#matching)
* [`throwing`](#throwing)
* [`throwingWith`](#throwingWith)
* [`resolved`](#resolved)
* [`resolvedWith`](#resolvedWith)
* [`rejected`](#rejected)
* [`rejectedWith`](#rejectedWith)

### `sameAs`
Asserts strict equality over two values, using the `===` operator.
Useful for comparing primitives, or asserting that two values point at the same reference.

**Example:**
```js
expect('hello').toBe(sameAs('hello'));
```

### `equal`
Compares two values recursively using deep equality. Two values would pass
this assertion if they have the same values and properties, even if they are not the same instance.
Useful for comparing objects, arrays, and everything that is not a primitive.

**Example:**
```js
expect({ hello: 'world' }).toBe(equal({ hello: world }))
```

### `withLength`
For an integer n, asserts that a string is n characters long, or that an array has n items.
If the actual value is not a string nor an array, it will be rejected.

**Example:**
```js
expect(['one', 'two', 'three']).toBe(withLength(3));
expect('123').toBe(withLength(3));
```

### `withProperty`
Asserts that an object has a property with the given key.
Optionally, you can also assert that said key contains a specific value.
If a value is passed, it will use deep equality over the expected and actual values.

**Example:**
```js
expect({ 'a': 1 }).toBe(withProperty('a'));
expect({ 'a': 1 }).toBe(withProperty('a', 1));
expect({ 'a': { b: 1 } }).toBe(withProperty('a', { b: 1 }));
```

### `between`
Asserts that a number is within the range of [min, max] (inclusive).

**Example:**
```js
expect(2).toBe(between(1, 3))
```

### `defined`
Asserts that a value is not `undefined`.

**Example:**
```js
expect('yes').toBe(defined)
```

### `falsy`
Asserts that a value is falsy (that is: `false`, `0`, `''`, `null` and `undefined`).

**Example:**
```js
expect(false).toBe(falsy);
expect(0).toBe(falsy);
expect(null).toBe(falsy);
```

### `truthy`
Asserts that a value is truthy (that is, not `false`, `0`, `''`, `null` and `undefined`).

**Example:**
```js
expect(true).toBe(truthy);
expect(1).toBe(truthy);
expect({}).toBe(truthy);
```

### `greaterThan`
Asserts that a given number is greater than expected.

**Example:**
```js
expect(5).toBe(greaterThan(4));
```

### `greaterThanEqual`
Asserts that a given number is greater than or equal expected.

**Example:**
```js
expect(5).toBe(greaterThanEqual(4));
expect(4).toBe(greaterThanEqual(4));
```

### `lessThan`
Asserts that a given number is less than expected.

**Example:**
```js
expect(4).toBe(lessThan(3));
```

### `lessThanEqual`
Asserts that a given number is less than or equal expected.

**Example:**
```js
expect(4).toBe(lessThanEqual(5));
expect(4).toBe(lessThanEqual(4));
```

### `instanceOf`
For a given class C, asserts that the given value is an instance of C.

As it uses the `instanceof` operator internally, this assertion follows the entire prototype
chain, and will also pass if the expected value is an instance of any class that extends C.

**Example:**
```js
const a = new C();
expect(a).toBe(instanceOf(C));
```

### `aNull`
Asserts that the given value is `null`.

**Example:**
```js
expect(null).toBe(aNull);
```

### `anUndefined`
Asserts that the given value is `undefined`.

**Example:**
```js
expect(undefined)toBe(anUndefined)
```

### `aNaN`
Asserts that the given value is `NaN` (not a number).

**Example:**
```js
expect('a' * 5).toBe(aNaN)
```

### `havingSameElementsAs`
An array operation.

Asserts that any two arrays have exactly the same elements, regardless the order.
The elements are tested using deep equality, which means that they can be of any form: primitive or otherwise.

**Example:**
```js
expect([1, { hello: true }, '701']).toBe(havingSameElementsAs([{ hello: true }, 1, '701']));
```

### `aSupersetOf`
An array operation.

Asserts that the actual array contains every element in the expected array.
The order of elements is disregarded, and they are tested using deep equality,
which means that they can be of any form: primitive or otherwise.

**Example:**
```js
expect([1, '2', { game: 'yahtzee' }]).toBe(aSupersetOf(['2', 1]));
```

### `aSubsetOf`
An array operation.

Asserts that the actual array is contained within the expected array.
The order of elements is disregarded, and they are tested using deep equality,
which means that they can be of any form: primitive or otherwise.

**Example:**
```js
expect([1, '2']).toBe(aSupersetOf(['2', { game: 'yahtzee' } , 1]));
```

### `matching`
Asserts that the given string matches the expected string or regex.

If the expected value is a string, we test that the actual value includes it,
using the `string.include` method.

If the expected value is a regex, we test that the actual value matches it
using the `regex.test` method.

**Example:**
```js
expect('hello, world').toBe(matching('hello'));
expect('hello, world').toBe(matching(/^hello.*/));
```

### `throwing`
Asserts that a given function throws.

The function will be receiving zero parameters, so if you
need to call the expected function with parameters, simply wrap
it using an anonymous function.

**Example:**
```js
expect(() => { throw new Error() }).toBe(throwing);
expect(() => divideOrThrow(100, 0)).toBe(throwing);
```

### `throwingWith`
Asserts that a given function throws with an error that matches the expected value.

* If the expected value is an error class, it checks that the given function throws an error that is an instance of the same class.
* If the expected value is an instance of an error, it checks that the given function throws an error with similar class and message.
* If the expected value is a string or a regex, it checks that the thrown error's message includes (or matches) the expected value.

If a string was thrown (instead of an error object), the assertion would fail if the given value is an error instance or class,
but if a string or a regex were passed, it will match them over the thrown string (instead of looking for an error message).

The function will be receiving zero parameters, so if you
need to call the expected function with parameters, simply wrap
it using an anonymous function.

**Example:**
```js
expect(() => { throw new AssertionError('Whoops') }).toBe(throwingWith(AssertionError));
expect(() => { throw new AssertionError('Whoops') }).toBe(throwingWith(new AssertionError('Whoops')));
expect(() => { throw new AssertionError('Whoops') }).toBe(throwingWith('Whoops'));
expect(() => { throw new AssertionError('Whoops') }).toBe(throwingWith(/^Who+ps$/));
expect(() => { throw 'Whoops'; }).toBe(throwingWith('Whoops'));
expect(() => { throw 'Whoops'; }).toBe(throwingWith(/^Who+ps$/));
```

### `resolved`
Asserts that a promise was resolved.

> ℹ️ This assertion is async, so you have to await upon it.

**Example:**
```js
await expect(Promise.resolve()).toBe(resolved);
```

### `resolvedWith`
Asserts that a promise was resolved with an expected value.
The actual and expected values are compared using deep equality.

> ℹ️ This assertion is async, so you have to await upon it.

**Example:**
```js
await expect(Promise.resolve(42)).toBe(resolvedWith(42));
await expect(Promise.resovle({ movie: 'lion king' })).toBe(resolvedWith({ movie: 'lion king' }));
```

### `rejected`
Asserts that a promise was rejected.

> ℹ️ This assertion is async, so you have to await upon it.

**Example:**
```js
await expect(Promise.reject()).toBe(rejected);
```

### `rejectedWith`
Asserts that a promise was rejected with an expected value.

This assertion follows the same rules of the [throwingWith](#throwingWith) assertion:

* If the expected value is an error class, it checks that the given promise rejects with an error that is an instance of the same class.
* If the expected value is an instance of an error, it checks that the given promise rejects with an error with similar class and message.
* If the expected value is a string or a regex, it checks that the reject error's message includes (or matches) the expected value.

If the promise was rejected with a string (instead of an error object), the assertion would fail if the given value is an error instance or class,
but if a string or a regex were passed, it will match them over the string (instead of looking for an error message).

> ℹ️ This assertion is async, so you have to await upon it.

**Example:**
```js
await expect(Promise.reject(new AssertionError('Whoops'))).toBe(rejectedWith(AssertionError));
await expect(Promise.reject(new AssertionError('Whoops'))).toBe(rejectedWith(new AssertionError('Whoops')));
await expect(Promise.reject(new AssertionError('Whoops'))).toBe(rejectedWith('Whoops'));
await expect(Promise.reject(new AssertionError('Whoops'))).toBe(rejectedWith(/^Who+ps$/));
await expect(Promise.reject('Whoops')).toBe(rejectedWith('Whoops'));
await expect(Promise.reject('Whoops')).toBe(rejectedWith(/^Who+ps$/));
```

## Jest


* [`aJestMock`](#aJestMock)
* [`called`](#called)
* [`calledTimes`](#calledTimes)
* [`calledWith`](#calledWith)
* [`lastCalledWith`](#lastCalledWith)
* [`nthCalledWith`](#nthCalledWith)
* [`returning`](#returning)
* [`returningWith`](#returningWith)
* [`lastReturningWith`](#lastReturningWith)
* [`nthReturningWith`](#nthReturningWith)If you are using Jest as your test runner, it is likely that you are using its features as well.

**twobees** comes with a set of jest-specific assertion functions. That said, they are not
included in the main bundle, and you have to import them from within the jest entry point:

```js
import { expect } from 'twobees';
import { aJestMock, calledWith, returningWith, ... } from 'twobees/assertions/jest';
```

### `aJestMock`
Asserts that a given value is a jest mock (for example, `jest.fn()`).

**Example:**
```js
expect(jest.fn()).toBe(aJestMock)
```

### `called`
A jest.Mock operation.

Asserts that the given jest mock was called at least once.

**Example:**
```js
const fn = jest.fn();
fn();
expect(fn).toBe(called);
```

### `calledTimes`
A jest.Mock operation.

Asserts that the given jest mock was called exactly n times.

**Example:**
```js
const fn = jest.fn();
fn();
fn();
expect(fn).toBe(calledTimes(2));
```

### `calledWith`
A jest.Mock operation.

Asserts that the given jest mock was called with the expected args.

If the mock was called several times, it checks that it was called with the
expected args at least once.

**Example:**
```js
const fn = jest.fn();
fn(1, '2', true);
expect(fn).toBe(calledWith(1, '2', true));
```

### `lastCalledWith`
A jest.Mock operation.

Asserts that the given jest mock was last called with the expected args.

It ignores any previous calls to the mock, and only looks at the last one,
so even if the mock *was* called in the past with the given args, the assertion
would fail if they were not used for the last call.

**Example:**
```js
const fn = jest.fn();
fn(1, '2', true);
fn(2, '1', false);
expect(fn).toBe(lastCalledWith(2, '1', false));
```

### `nthCalledWith`
A jest.Mock operation.

Asserts that the nth call to the given jest mock used the expected args.

It ignores any other calls to the mock, and only looks at the nth one,
so even if the mock *was* called in the past with the given args in another call,
the assertion would fail if they were not used for the nth one.

The n variable is one-based, meaning that the first call is `1`, and not `0`.

**Example:**
```js
const fn = jest.fn();
fn(1, '2', true);
fn(2, '1', false);
fn(2, '3', true);
expect(fn).toBe(nthCalledWith(1, 1, '2', true));
expect(fn).toBe(nthCalledWith(2, 2, '1', false));
expect(fn).toBe(nthCalledWith(3, 2, '3', true));
```

### `returning`
A jest.Mock operation.

Asserts that the given jest mock has returned successfully at least once.

Fails if the mock only thrown errors, or if it was never called at all.

**Example:**
```js
const fn = jest.fn();
fn();
expect(fn).toBe(returning);
```

### `returningWith`
A jest.Mock operation.

Asserts that the given jest mock has returned successfully at least once with the expected value.

It uses deep equality to compare the values.

**Example:**
```js
const fn = jest.fn().mockReturnValue(1337);
fn();
expect(fn).toBe(returningWith(1337));

const fn = jest.fn().mockReturnValue({ name: 'roy' });
fn();
expect(fn).toBe(returningWith({ name: 'roy' }));
```

### `lastReturningWith`
A jest.Mock operation.

Asserts that the final call to the given jest mock has returned the expected value.

It ignores any previous calls to the mock, and only looks at the last one,
so even if the mock *has* returned the expected value in the past, the assertion
would fail if it was not returned in the last call.

It uses deep equality to compare the values.

**Example:**
```js
const fn = jest.fn();
fn();
fn.mockReturnValue(1337);
fn();
expect(fn).toBe(lastReturningWith(1337));

const fn = jest.fn();
fn();
fn.mockReturnValue({ name: 'roy' });
fn();
expect(fn).toBe(lastReturningWith({ name: 'roy' }));
```

### `nthReturningWith`
A jest.Mock operation.

Asserts that the nth call to the given jest mock has returned the expected value.

It ignores any other calls to the mock, and only looks at the nth one,
so even if the mock *has* returned the expected value in other invocations, the assertion
would fail if it was not returned in the nth call.

The n variable is one-based, meaning that the first call is `1`, and not `0`.

It uses deep equality to compare the values.

**Example:**
```js
const fn = jest.fn();
fn();
fn.mockReturnValue(1337);
fn();
fn.mockReturnValue(1338);
fn();
expect(fn).toBe(nthReturningWith(2, 1337));

const fn = jest.fn();
fn();
fn.mockReturnValue({ name: 'roy' });
fn();
fn.mockReturnValue({ name: 'bob' });
fn();
expect(fn).toBe(nthReturningWith(2, { name: 'roy' }));
```