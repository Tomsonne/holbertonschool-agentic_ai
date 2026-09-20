'use strict';

const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const { describe, it } = require('node:test');
const path = require('node:path');

const projectFile = (name) => path.join(__dirname, '..', name);

describe('Gemini configuration', () => {
  it('documents the required Gemini variables without legacy OpenAI variables', async () => {
    const exampleEnvironment = await readFile(projectFile('.env.example'), 'utf8');

    assert.match(exampleEnvironment, /^GEMINI_API_KEY=$/m);
    assert.match(exampleEnvironment, /^GEMINI_MODEL=$/m);
    assert.doesNotMatch(exampleEnvironment, /^OPENAI_(?:API_KEY|MODEL)=/m);
  });

  it('passes the required Gemini variables only to the worker service', async () => {
    const compose = await readFile(projectFile('docker-compose.yml'), 'utf8');

    assert.match(compose, /GEMINI_API_KEY: \$\{GEMINI_API_KEY:-\}/);
    assert.match(compose, /GEMINI_MODEL: \$\{GEMINI_MODEL:-\}/);
    assert.doesNotMatch(compose, /OPENAI_(?:API_KEY|MODEL):/);
  });
});
