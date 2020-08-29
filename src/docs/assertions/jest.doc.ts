import type { DocOfFile } from '../types';
import * as jestAssertionFile from '../../assertions/jest';

const docs: DocOfFile<typeof jestAssertionFile> = {
  introduction: `
    If you are using Jest as your test runner, it is likely that you are using its features as well.

    **twobees** comes with a set of jest-specific assertion functions. That said, they are not
    included in the main bundle, and you have to import them from within the jest entry point:

    \`\`\`js
    import { expect } from 'twobees';
    import { aJestMock, calledWith, returningWith, ... } from 'twobees/assertions/jest';
    \`\`\`
  `,
  content: {
    aJestMock: {
      description: `
        Asserts that a given value is a jest mock (for example, \`jest.fn()\`).
      `,
      example: `
        expect(jest.fn()).toBe(aJestMock)
      `,
    },
    called: {
      description: `
        A jest.Mock operation.

        Asserts that the given jest mock was called at least once.
      `,
      example: `
        const fn = jest.fn();
        fn();
        expect(fn).toBe(called);
      `,
    },
    calledTimes: {
      description: `
        A jest.Mock operation.

        Asserts that the given jest mock was called exactly n times.
      `,
      example: `
        const fn = jest.fn();
        fn();
        fn();
        expect(fn).toBe(calledTimes(2));
      `,
    },
    calledWith: {
      description: `
        A jest.Mock operation.

        Asserts that the given jest mock was called with the expected args.

        If the mock was called several times, it checks that it was called with the
        expected args at least once.
      `,
      example: `
        const fn = jest.fn();
        fn(1, '2', true);
        expect(fn).toBe(calledWith(1, '2', true));
      `,
    },
    lastCalledWith: {
      description: `
        A jest.Mock operation.

        Asserts that the given jest mock was last called with the expected args.

        It ignores any previous calls to the mock, and only looks at the last one,
        so even if the mock *was* called in the past with the given args, the assertion
        would fail if they were not used for the last call.
      `,
      example: `
        const fn = jest.fn();
        fn(1, '2', true);
        fn(2, '1', false);
        expect(fn).toBe(lastCalledWith(2, '1', false));
      `,
    },
    nthCalledWith: {
      description: `
        A jest.Mock operation.

        Asserts that the nth call to the given jest mock used the expected args.

        It ignores any other calls to the mock, and only looks at the nth one,
        so even if the mock *was* called in the past with the given args in another call,
        the assertion would fail if they were not used for the nth one.

        The n variable is one-based, meaning that the first call is \`1\`, and not \`0\`.
      `,
      example: `
        const fn = jest.fn();
        fn(1, '2', true);
        fn(2, '1', false);
        fn(2, '3', true);
        expect(fn).toBe(nthCalledWith(1, 1, '2', true));
        expect(fn).toBe(nthCalledWith(2, 2, '1', false));
        expect(fn).toBe(nthCalledWith(3, 2, '3', true));
      `,
    },
    returning: {
      description: `
        A jest.Mock operation.

        Asserts that the given jest mock has returned successfully at least once.

        Fails if the mock only thrown errors, or if it was never called at all.
      `,
      example: `
        const fn = jest.fn();
        fn();
        expect(fn).toBe(returning);
      `,
    },
    returningWith: {
      description: `
        A jest.Mock operation.

        Asserts that the given jest mock has returned successfully at least once with the expected value.

        It uses deep equality to compare the values.
      `,
      example: `
        const fn = jest.fn().mockReturnValue(1337);
        fn();
        expect(fn).toBe(returningWith(1337));

        const fn = jest.fn().mockReturnValue({ name: 'roy' });
        fn();
        expect(fn).toBe(returningWith({ name: 'roy' }));
      `,
    },
    lastReturningWith: {
      description: `
        A jest.Mock operation.

        Asserts that the final call to the given jest mock has returned the expected value.

        It ignores any previous calls to the mock, and only looks at the last one,
        so even if the mock *has* returned the expected value in the past, the assertion
        would fail if it was not returned in the last call.

        It uses deep equality to compare the values.
      `,
      example: `
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
      `,
    },
    nthReturningWith: {
      description: `
        A jest.Mock operation.

        Asserts that the nth call to the given jest mock has returned the expected value.

        It ignores any other calls to the mock, and only looks at the nth one,
        so even if the mock *has* returned the expected value in other invocations, the assertion
        would fail if it was not returned in the nth call.
        
        The n variable is one-based, meaning that the first call is \`1\`, and not \`0\`.

        It uses deep equality to compare the values.
      `,
      example: `
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
      `,
    },
  },
};

export default docs;
