import fs from 'fs';

const guard = <T>(fn: () => T): T => {
  try {
    return fn();
  } catch (err) {
    // ignore
  }
};

function createEntryPoints() {
  guard(() => fs.mkdirSync('./assertions'));
  fs.readdirSync('./assertions').forEach((file) =>
    fs.unlinkSync(`./assertions/${file}`)
  );

  const matchers = fs.readdirSync('./src/assertions');
  matchers.forEach((matcher) => {
    const matcherName = matcher.split('.').shift();
    fs.writeFileSync(
      `./assertions/${matcherName}.js`,
      `module.exports = require('../dist/src/assertions/${matcherName}');\n`
    );
    fs.writeFileSync(
      `./assertions/${matcherName}.d.ts`,
      `export * from '../dist/src/assertions/${matcherName}';\n`
    );
  });
}

createEntryPoints();
