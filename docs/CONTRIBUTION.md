# Contribution Guidelines
Thank you for taking an interest in contributing to **twobees**! Whether you want to contribute a new feature, report an error, or fix a bug - you've come to the right place.

## Getting Started
We follow the github open source flow. If you've never done this before, you can start off by reading about the workflow [here](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

If you're familiar with the process, start by forking the repository and cloning. 

Then, let's make sure that everything is working correctly by installing the dependencies:

```sh
yarn
```

As you can see, we're using `yarn` in this project. Please try to use it as well in order to keep the lockfile in sync.

The next thing to do would be to ensure that everything works as expected. You can do that by running the tests:

```sh
yarn test
```

If all passes, you're good to go!

### Before Pushing
Before you push your code and open a pull request, please ensure the following:
1. Relevant tests were written, and they all pass.
2. Docs were updated accordingly.
3. You have run `yarn build:docs`, and updated them.

Once you're done, open a PR with a descriptive explanation. We'll get to it asap!

## Project Structure
The project has the following permanent directories:
```
- src: where the source code is
|- assertions: where the assertion library files can be found
|- docs: dynamic documentation files. used for generating api docs
- test: where the tests are
|- assertions: where the assertion library tests can be found
|- utils: testing utilities
- scripts: task scripts can be found here
- docs: where the in-depth docs can be found
```

The following directories are created during the build process, and
are not committed to git:
```
- dist: where the generated js code can be found
- assertions: contain entrypoint files to the assertion library
```


## Contributing
Do you want to contribute code? Thank you so much. We use a development paradigm called TDD - test driven development. This essentially means that every added piece of code should be tested.

In the following sections we'll tell you exactly what you need to do in order to contribute code to the different parts of the software.

### Assertions Library
In order to contribute an assertion (or modify an existing one), you need to do the following:
1. Write tests: find the test file for your assertion file under `test/assertions`. For example, if you want to edit `basic` assertions, you need to write a test under `test/assertions/basic.spec.ts`. Take a look at existing tests to get a sense of how they should be written.
2. Write the code: contribute the code to the relevant file. Please take a moment to get the general sense of styling, naming and typing conventions in the code, and please try to follow suit.
3. Write docs: the final part is to update the documentation related to the changed \ added assertion. You can find a corresponding `doc` file under `src/docs/assertions`. The assertion library documentation is generated from the files.

Don't forget to run your tests and generate docs before pushing!

### Expect
In order to contribute to the `expect` function (and related units), simply locate the relevant file in the `src` directory.

Please ensure to cover your changes with relevant tests. The tests for the `expect` function (and the related units) can be found under `test/expect.spec.ts`.
