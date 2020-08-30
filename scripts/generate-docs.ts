import fs from 'fs';
import dedent from 'dedent';
import basicDocs from '../src/docs/assertions/basic.doc';
import jestDocs from '../src/docs/assertions/jest.doc';

const rewriteAssertionsFromDocs = () => {
  const assertionsMd =
    `# Assertions Library\n` +
    `**twobees** come with a variety of assertion functions. Read all about them here.\n\n` +
    `* [Basic](#basic)\n` +
    `* [Jest](#jest)\n\n` +
    `## Basic\n` +
    `${dedent(basicDocs.introduction)}\n\n` +
    Object.keys(basicDocs.content)
      .map((assertion) => `* [\`${assertion}\`](#${assertion.toLowerCase()})`)
      .join('\n') +
    `\n\n` +
    Object.entries(basicDocs.content)
      .map(
        ([title, content]) =>
          `### \`${title}\`\n` +
          `${dedent(content.description)}\n\n` +
          `**Example:**\n` +
          `\`\`\`js\n` +
          `${dedent(content.example)}\n` +
          `\`\`\``
      )
      .join('\n\n') +
    `\n\n` +
    `## Jest\n` +
    `${dedent(jestDocs.introduction)}\n\n` +
    Object.keys(jestDocs.content)
      .map((assertion) => `* [\`${assertion}\`](#${assertion.toLowerCase()})`)
      .join('\n') +
    `\n\n` +
    Object.entries(jestDocs.content)
      .map(
        ([title, content]) =>
          `### \`${title}\`\n` +
          `${dedent(content.description)}\n\n` +
          `**Example:**\n` +
          `\`\`\`js\n` +
          `${dedent(content.example)}\n` +
          `\`\`\``
      )
      .join('\n\n');

  fs.writeFileSync('./docs/ASSERTIONS.md', assertionsMd);
};

rewriteAssertionsFromDocs();
