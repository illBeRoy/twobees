import type { DocOfFile } from '../types';
import * as basicAssertionFile from '../../assertions/basic';

const docs: DocOfFile<typeof basicAssertionFile> = {
  introduction: `
    The basic, fundamental assertions that you need to cover your tests.
    They are included in the main \`twobees\` package, and you can simply import
    them from there:

    \`\`\`js
    import { sameAs, equal, ... } from 'twobees';
    \`\`\`
  `,
  content: {
    sameAs: {
      description: `
      Asserts strict equality over two values, using the \`===\` operator.
      Useful for comparing primitives, or asserting that two values point at the same reference.
    `,
      example: `
      expect('hello').toBe(sameAs('hello'));
    `,
    },
    equal: {
      description: `
      Compares two values recursively using deep equality. Two values would pass
      this assertion if they have the same values and properties, even if they are not the same instance.
      Useful for comparing objects, arrays, and everything that is not a primitive.
    `,
      example: `
      expect({ hello: 'world' }).toBe(equal({ hello: world }))
    `,
    },
    withLength: {
      description: `
      For an integer n, asserts that a string is n characters long, or that an array has n items.
      If the actual value is not a string nor an array, it will be rejected.
    `,
      example: `
      expect(['one', 'two', 'three']).toBe(withLength(3));
      expect('123').toBe(withLength(3));
    `,
    },
    withProperty: {
      description: `
      Asserts that an object has a property with the given key.
      Optionally, you can also assert that said key contains a specific value.
      If a value is passed, it will use deep equality over the expected and actual values.
    `,
      example: `
      expect({ 'a': 1 }).toBe(withProperty('a'));
      expect({ 'a': 1 }).toBe(withProperty('a', 1));
      expect({ 'a': { b: 1 } }).toBe(withProperty('a', { b: 1 }));
    `,
    },
    between: {
      description: `
      Asserts that a number is within the range of [min, max] (inclusive).
    `,
      example: `
      expect(2).toBe(between(1, 3))
    `,
    },
    defined: {
      description: `
      Asserts that a value is not \`undefined\`.
    `,
      example: `
      expect('yes').toBe(defined)
    `,
    },
    falsy: {
      description: `
      Asserts that a value is falsy (that is: \`false\`, \`0\`, \`''\`, \`null\` and \`undefined\`).
    `,
      example: `
      expect(false).toBe(falsy);
      expect(0).toBe(falsy);
      expect(null).toBe(falsy);
    `,
    },
    truthy: {
      description: `
      Asserts that a value is truthy (that is, not \`false\`, \`0\`, \`''\`, \`null\` and \`undefined\`).
    `,
      example: `
      expect(true).toBe(truthy);
      expect(1).toBe(truthy);
      expect({}).toBe(truthy);
    `,
    },
    greaterThan: {
      description: `
      Asserts that a given number is greater than expected.
    `,
      example: `
      expect(5).toBe(greaterThan(4));
    `,
    },
    greaterThanEqual: {
      description: `
      Asserts that a given number is greater than or equal expected.
    `,
      example: `
      expect(5).toBe(greaterThanEqual(4));
      expect(4).toBe(greaterThanEqual(4));
    `,
    },
    lessThan: {
      description: `
      Asserts that a given number is less than expected.
    `,
      example: `
      expect(4).toBe(lessThan(3));
    `,
    },
    lessThanEqual: {
      description: `
      Asserts that a given number is less than or equal expected.
    `,
      example: `
      expect(4).toBe(lessThanEqual(5));
      expect(4).toBe(lessThanEqual(4));
    `,
    },
    instanceOf: {
      description: `
      For a given class C, asserts that the given value is an instance of C.

      As it uses the \`instanceof\` operator internally, this assertion follows the entire prototype
      chain, and will also pass if the expected value is an instance of any class that extends C.
    `,
      example: `
      const a = new C();
      expect(a).toBe(instanceOf(C));
    `,
    },
    aNull: {
      description: `
      Asserts that the given value is \`null\`.
    `,
      example: `
      expect(null).toBe(aNull);
    `,
    },
    anUndefined: {
      description: `
      Asserts that the given value is \`undefined\`.
    `,
      example: `
      expect(undefined)toBe(anUndefined)
    `,
    },
    aNaN: {
      description: `
      Asserts that the given value is \`NaN\` (not a number).
    `,
      example: `
      expect('a' * 5).toBe(aNaN)
    `,
    },
    havingSameElementsAs: {
      description: `
      An array operation.

      Asserts that any two arrays have exactly the same elements, regardless the order.
      The elements are tested using deep equality, which means that they can be of any form: primitive or otherwise.
    `,
      example: `
      expect([1, { hello: true }, '701']).toBe(havingSameElementsAs([{ hello: true }, 1, '701']));
    `,
    },
    aSupersetOf: {
      description: `
      An array operation.

      Asserts that the actual array contains every element in the expected array.
      The order of elements is disregarded, and they are tested using deep equality,
      which means that they can be of any form: primitive or otherwise.
    `,
      example: `
      expect([1, '2', { game: 'yahtzee' }]).toBe(aSupersetOf(['2', 1]));
    `,
    },
    aSubsetOf: {
      description: `
      An array operation.

      Asserts that the actual array is contained within the expected array.
      The order of elements is disregarded, and they are tested using deep equality,
      which means that they can be of any form: primitive or otherwise.
    `,
      example: `
      expect([1, '2']).toBe(aSupersetOf(['2', { game: 'yahtzee' } , 1]));
    `,
    },
    matching: {
      description: `
      Asserts that the given string matches the expected string or regex.

      If the expected value is a string, we test that the actual value includes it,
      using the \`string.include\` method.

      If the expected value is a regex, we test that the actual value matches it
      using the \`regex.test\` method.
    `,
      example: `
      expect('hello, world').toBe(matching('hello'));
      expect('hello, world').toBe(matching(/^hello.*/));
    `,
    },
    throwing: {
      description: `
      Asserts that a given function throws.

      The function will be receiving zero parameters, so if you
      need to call the expected function with parameters, simply wrap
      it using an anonymous function.
    `,
      example: `
      expect(() => { throw new Error() }).toBe(throwing);
      expect(() => divideOrThrow(100, 0)).toBe(throwing);
    `,
    },
    throwingWith: {
      description: `
      Asserts that a given function throws with an error that matches the expected value.

      * If the expected value is an error class, it checks that the given function throws an error that is an instance of the same class.
      * If the expected value is an instance of an error, it checks that the given function throws an error with similar class and message.
      * If the expected value is a string or a regex, it checks that the thrown error's message includes (or matches) the expected value.

      If a string was thrown (instead of an error object), the assertion would fail if the given value is an error instance or class,
      but if a string or a regex were passed, it will match them over the thrown string (instead of looking for an error message).
      
      The function will be receiving zero parameters, so if you
      need to call the expected function with parameters, simply wrap
      it using an anonymous function.
    `,
      example: `
      expect(() => { throw new AssertionError('Whoops') }).toBe(throwingWith(AssertionError));
      expect(() => { throw new AssertionError('Whoops') }).toBe(throwingWith(new AssertionError('Whoops')));
      expect(() => { throw new AssertionError('Whoops') }).toBe(throwingWith('Whoops'));
      expect(() => { throw new AssertionError('Whoops') }).toBe(throwingWith(/^Who+ps$/));
      expect(() => { throw 'Whoops'; }).toBe(throwingWith('Whoops'));
      expect(() => { throw 'Whoops'; }).toBe(throwingWith(/^Who+ps$/));
    `,
    },
    resolved: {
      description: `
        Asserts that a promise was resolved.

        > ℹ️ This assertion is async, so you have to await upon it.
      `,
      example: `
        await expect(Promise.resolve()).toBe(resolved);
      `,
    },
    resolvedWith: {
      description: `
        Asserts that a promise was resolved with an expected value.
        The actual and expected values are compared using deep equality.

        > ℹ️ This assertion is async, so you have to await upon it.
      `,
      example: `
        await expect(Promise.resolve(42)).toBe(resolvedWith(42));
        await expect(Promise.resovle({ movie: 'lion king' })).toBe(resolvedWith({ movie: 'lion king' }));
      `,
    },
    rejected: {
      description: `
        Asserts that a promise was rejected.

        > ℹ️ This assertion is async, so you have to await upon it.
      `,
      example: `
        await expect(Promise.reject()).toBe(rejected);
      `,
    },
    rejectedWith: {
      description: `
        Asserts that a promise was rejected with an expected value.

        This assertion follows the same rules of the [throwingWith](#throwingWith) assertion:

        * If the expected value is an error class, it checks that the given promise rejects with an error that is an instance of the same class.
        * If the expected value is an instance of an error, it checks that the given promise rejects with an error with similar class and message.
        * If the expected value is a string or a regex, it checks that the reject error's message includes (or matches) the expected value.
        
        If the promise was rejected with a string (instead of an error object), the assertion would fail if the given value is an error instance or class,
        but if a string or a regex were passed, it will match them over the string (instead of looking for an error message).

        > ℹ️ This assertion is async, so you have to await upon it.
      `,
      example: `
        await expect(Promise.reject(new AssertionError('Whoops'))).toBe(rejectedWith(AssertionError));
        await expect(Promise.reject(new AssertionError('Whoops'))).toBe(rejectedWith(new AssertionError('Whoops')));
        await expect(Promise.reject(new AssertionError('Whoops'))).toBe(rejectedWith('Whoops'));
        await expect(Promise.reject(new AssertionError('Whoops'))).toBe(rejectedWith(/^Who+ps$/));
        await expect(Promise.reject('Whoops')).toBe(rejectedWith('Whoops'));
        await expect(Promise.reject('Whoops')).toBe(rejectedWith(/^Who+ps$/));
      `,
    },
  },
};

export default docs;
