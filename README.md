<p align="center">
<img src="https://raw.githubusercontent.com/illBeRoy/twobees/master/logo.svg">
</p>

<p align="center">
assertions with a <i>buzz</i> 🐝
</p>

<p align="center">
<a href="https://github.com/illBeRoy/twobees/actions?query=workflow%3A%22Tests+CI%22+branch%3Amaster" target="_blank">
  <img src="https://img.shields.io/github/workflow/status/illBeRoy/twobees/Tests%20CI/master?style=flat-square" />
</a>
<a href="https://npmjs.com/package/twobees" target="_blank">
  <img src="https://img.shields.io/npm/v/twobees?style=flat-square" />
</a>
</p>

```ts
// take this simple function
const sameAs = <T>(expected: T) => (actual: T) => actual === expected;
// and this simple value
const foo = 5;
// put them here together
expect(foo).toBe(sameAs(5));
// done!
```

### Features
* 🎈 **Simple** - only one expectation method - *toBe*. in exchange for all the magic methods, every boolean function is an assertion!
* 🏁 **Comprehensive** - contains a rich library of assertion functions and even optional ootb support for jest!
* 🕹 **Hackable** - easily write your own special assertions for your code! extend and compose existing assertions!
* 📠 **Type Safe** - we leverage typescript to find type errors before you even hit that run button!

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  * [Installing](#installing)
  * [Your First Test](#your-first-test)
- [API](#api)
  * [`toBe` - simple assertion](#tobe---simple-assertion)
  * [`not.toBe` - negated assertion](#nottobe---negated-assertion)
  * [`toBeEither` - soft assertion](#tobeeither---soft-assertion)
  * [Assertions Library](#assertions-library)
  * [Using With Jest](#using-with-jest)
- [Hacking](#hacking)
  * [Boolean Predicates](#boolean-predicates)
  * [Meaningful Errors](#meaningful-errors)
  * [Diffs](#diffs)
  * [Async Assertions](#async-assertions-1)
  * [Composition](#composition)
- [Contribution](#contribution)

## Introduction
**twobees** is a simple assertion library. How simple? There is only one main expectation method: `.toBe()`.

`toBe` is an all-powerful method that receives assertion functions, and uses them run assertions over your code:

```js
expect(thisIs).toBe(equal('fine 🔥🐶☕️🔥'));
expect(myProblems).toBe(greaterThan(99));
await expect(iMakeNoPromises).toBe(rejectedWith('tonight'));
```

While **twobees** come with plenty of assertions to begin with (read about them [here](./docs/ASSERTIONS.md)), you can extend upon the existing with your own tailor-made assertions that serve your code!

How do you write your own assertion functions? Surprise! Every boolean function can be used for as an assertion. This gives you the power to actually write meaningful assertions that make sense in your code:

```jsx
// testing for a todo component to have the right amount of items
describe('<Todo /> component', () => {
  it('should have as many items as given', () => {
    const todos = [
      'get milk',
      'pick up the kids',
      'write a bestselling vampire novel'
    ];
    const wrapper = render(<Todo todos={todos} />);

    expect(wrapper).toBe(renderedWithTodosCount(3));
  });
});

// this predicate does the heavy lifting,
// so we get a meaningful assertion!
const renderedWithTodosCount = count => wrapper => {
  return wrapper.queryAllByTestId('todo-item').length === count;
}
```

That said, you also have a method for providing meaningful errors and even diffs - read about them in the [hacking](#hacking) part of this readme.

### Async Assertions
Need to wait upon a promise? Have an async operation to assert upon? No problem! Async assertions are supported out of the box. `toBe` identifies async assertions and returns an awaitable promise without you having to tell it:

```js
// this expect has become async,
// since the assertion function inside of it is async!
await expect(somePromise).toBe(rejected);
```
### Typescript Support
Finally, **twobees** has built-in typescript support, and respects your types even before you run anything. That's why every assertion function is typed, and `toBe` carries on these types, essentially blocking you from running tests which don't pass type check:

```ts
// Type 'string' is not assignable to type 'number'!
expect('foo').toBe(greaterThan(1));
```

## Getting Started
### Installing
You can start by installing `twobees` using *npm*:
```sh
npm install --save-dev twobees
```

Or, if you prefer *yarn*:
```sh
yarn add -D twobees
```

> ℹ️ No need to install a types library, twobees supports typescript out of the box.

### Your First Test
Simply import everything from the `twobees` package:

```ts
import { expect, equal } from 'twobees';

it('should be alright', () => {
  const everyLittleThing = 'alright';
  expect(everyLittleThing).toBe(equal('alright'));
});
```

**twobees** comes packed with every known assertion you know from other testing libraries. You can read about them in the [assertions document](./docs/ASSERTIONS.md).

> ℹ️ **twobees** works with most known testing libraries.

## API
### `toBe` - simple assertion
```js
expect(harryPotter).toBe(equal('wizard'));
```

The most simple use of `expect` is with the `toBe` function. This function accepts a predicate that runs over the actual value and decides whether or not it passes or not, and why.

The `toBe` function will throw an `ExpectationFailureError` immediately if an assertion has failed. The error will possibly contain an explanation, and even a diff of the expected value and the actual, if possible.

The function also supports async assertions out of the box. If an assertion returns a promise (e.g. the `rejected` assertion), `toBe` will return a promise that will resolve if the assertion has passed, or reject with an `ExpectationFailureError` otherwise.

Finally, `toBe` is fully typed. If your assertion functions expect a specific type of input, `toBe` will validate that the input actually matches the assertion. Otherwise, you will get a typescript error. In a similar fashion, `toBe` recognizes if the assertion function is async or not, and will have a `void` or `Promise<void>` type accordingly.

### `not.toBe` - negated assertion
```js
expect(powerLevel).not.toBe(lessThan(9000));
```

The `not.toBe` directive negates the assertion that `toBe` is given. It will pass if the assertion passed to `toBe` has failed, and fail otherwise.

Much like `toBe`, `not.toBe` supports sync and async assertions alike. Also, it will have a `void` or `Promise<void>` type accordingly.

Unlike `toBe`, though, `not.toBe` does not force types over the passed value. Since it's the negated condition, there are many cases where we'd intentionally pass a value of different type than expected.

### `toBeEither` - soft assertion
```js
expect(tonyStark).toBeEither(
  equal('genius'),
  equal('billionaire'),
  equal('philanthropist')
);
```

Sometimes you've multiple assertions, and you expect that at least one of them will pass, but possibly not all of them. That's why we have the `toBeEither` function - it acts as a logical ***or***, which means that it will pass if at least one of the assertions has passed.

Similarly to how `toBe` and `not.toBe` work, `toBeEither` returns a promise if **at least one** of the assertions is async. Otherwise, it will be completely sync and throw (or pass) immediately.

### Assertions Library
**twobees** comes with all standard assertions from equality to ranges and promises.

As we said before, assertions are simply functions that can be used with the `toBe` method.

You can import them from the `twobees` package:

```js
import { expect, equal, withLength, resolvedWith } from 'twobees';

expect('a').toBe(equal('a'));
expect([1, 2, 3]).toBe(withLength(2));
await expect(Promise.resolve('yes')).toBe(resolvedWith('yes'));
```

Since there are many different assertions, you can ead all about them [here](./docs/ASSERTIONS.md);

### Using With Jest
Jest is one of the most popular test runners in the javascript world right now. As a result, it is only natural for us to support it out of the box.

**twobees** comes with a set of jest-specific assertions (mainly revolving jest's mock mechanism).
Unlike the basic assertions, though, they are not included automatically (as **twobees** should be agnostic to your test runner by default).

If you want to use the jest assertions anyways, you can import them from the following path:

```js
import { expect } from 'twobees';
import { called } from 'twobees/assertions/jest';

const fn = jest.fn();
fn()
expect(fn).toBe(called);
```

Review the different jest assertions [here](./docs/ASSERTIONS.md#jest);

## Hacking
**twobees**' simple nature makes it **highly extensible**, as you can easily write your own assertions to complement your code. Assertions are basically functions of the following format:

```ts
export type AssertionFn<T> = (
  value: T
) =>
  | true // passed
  | false // failed
  | string // failed with a message
  | [string, Expected, Actual] // failed with a message and diff
  | Promise<boolean | string | [string, Expected, Actual]>; // is async
```

In this section will demonstrate how we can write our own assertion, using an example from the React testing world.

In our example, we're testing a `<Todo />` component with several assertions. Let's get started!

### Boolean Predicates
The most simple type of assertion is the boolean predicate. Boolean predicates are simple functions that return `true` or `false` - pass or fail.

Let's write a short assertion that verifies whether or not our `<Todo />` component has items:

```tsx
const havingItems = (wrapper: RenderResult) => {
  if (wrapper.queryAllByTestId('todo-item').length > 0) {
    return true;
  } else {
    return false;
  }
}
```

What do we have here? Our predicate looks up `todo-item` elements. If any exists, it returns `true`, hence passing the assertion. Otherwise, it returns `false`.

Also, pay attention that we've typed `wrapper` with `RenderResult` - this is a type that comes from `react-testing-library`. It tells `toBe` that this assertion can only be run over render results, hence typescript will refuse to transpile if any other value is passed.

Let's try using our new predicate:

```tsx
expect(filledList).toBe(havingItems);
expect(emptyList).not.toBe(havingItems);
```

### Meaningful Errors
There's one thing with boolean predicates, though, and that is that if they fail, they just tell you "I failed" and that's it. If we'd like to make our assertion fail with a meaningful message, we can simply return it:

```tsx
const havingItems = (wrapper: RenderResult) => {
  if (wrapper.queryAllByTestId('todo-item').length > 0) {
    return true;
  } else {
    return 'The given <Todo /> list is empty';
  }
}
```

Do note that if we want to pass, we still **must** return `true`.

Now, in case we fail our assertion, we get the following message:

```
Expectation failed:
  The given <Todo /> list is empty
```

Which is much more insightful!

### Diffs
Now, what if we wanted to display the two values side by side, so we can tell how they differ? We simply return a tuple of `[message, expected, actual]`. That way, **twobees** knows to format our error with the given message, and a diff between `expected` and `actual`.

Let's continue our example with a more generalized assertion - `havingNItems(n)`, which asserts that you have exactly `n` items:

```tsx
const havingNItems = (n: number) => (wrapper: RenderResult) => {
  const allItems = wrapper.queryAllByTestId('todo-item').length;
  if (allItems.length === n) {
    return true;
  } else {
    return [
      'The given <Todo /> list does not have the expected amount of items',
      n,
      allItems.length
    ];
  }
}
```

Do note that if we want to pass, we still **must** return `true`.

Now, if we fail the following expectation:
```ts
expect(listWithThreeItems).toBe(havingNItems(4));
```

we get the following message:

```
Expectation failed:
  The given <Todo /> list is empty
    - Expected
    + Received

    - 4
    + 3
```

Not too shabby!

### Async Assertions
Of course, from time to time we want to write async assertions. For example, what if our `<Todo />` component loads asynchronously from the internet?

Let's transform our `havingNItems` assertion into an async `displayingNItemsFromTheWeb`:

```tsx
const displayingNItemsFromTheWeb = (n: number) => async (wrapper: RenderResult) => {
  const allItems = await wrapper.findAllByTestId('todo-item');
  if (allItems.length === n) {
    return true;
  } else {
    return [
      'The given <Todo /> list did not load the expected amount of items',
      n,
      allItems.length
    ];
  }
}
```

See that making our assertion function `async` will give us an async expectation:

```ts
await expect(nanoEvernote).toBe(displayingNItemsFromTheWeb(4));
```

And that is it. Of course, if our async assertion passes, we should resolve with a `true` value (or return `true`, if our assertion is an async function).

### Composition
Writing our own assertions is all good and well, but we hackers want to extend upon existing assertions as well, or even compose over our own!

Luckily, **twobees* fully support assertion composition. You can use `expect` from within your assertion, and we'll handle it transparently.

Take the following `between` assertion, that uses `greaterThanEqual` and `lowerThanEqual` in order to check that a number is in range:

```ts
const between = (min: number, max: number) => (actual: number) => {
  expect(actual).toBe(greaterThanEqual(min));
  expect(actual).toBe(lowerThanEqual(max));
  return true;
}
```

As you can see, we use the `expect` factory in order to assert that our number is in range. In case that it actually is, we return `true`, as all assertions must return `true` in order to pass.

Composing assertion supports both logical AND operations, and logical ORs. That is, a composite assertion can be `expect A and B`, and it can also be `expect A or B`. Let's review the two methods.

#### AND Composition
The AND composition simply assures that all conditions are met in order to pass. In order to AND composite, all we have to do is to run assertions one after the other, as we did with the `between` assertion:

```ts
const between = (min: number, max: number) => (actual: number) => {
  expect(actual).toBe(greaterThanEqual(min));
  expect(actual).toBe(lowerThanEqual(max));
  return true;
}
```

#### OR Composition
The OR composition is more forgiving: not all inner assertions should pass, but if even one of them passes then we're good. In order to perform OR composition, we use the `expect.toBeEither` directive. Let's take a look at the `notBetween` assertion:

```ts
const notBetween = (min: number, max: number) => (actual: number) => {
  expect(actual).toBeEither(
    lowerThan(min),
    greaterThan(max),
  );
  return true;
}
```

The above assertion checks that one of two conditions is met (actual < min, or actual > max). If it does, we return `true`. Otherwise, `toBeEither` will fail our assertion.

## Contribution
**twobees** is still at its early stages. Issues and Pull Requests are welcome!
For more detailed explanation, please see our [contribution guidelines document](docs/CONTRIBUTION.md).
