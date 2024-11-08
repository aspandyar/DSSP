const request = require('supertest');
const assert = require('assert');
const app = require('../index');

// ANSI escape codes for coloring
const green = '\x1b[32m'; // Green
const red = '\x1b[31m'; // Red
const reset = '\x1b[0m'; // Reset to default

async function runTests() {
  try {
    // Test GET /api/example
    const getResponse = await request(app).get('/api/example');
    assert.strictEqual(getResponse.status, 200);
    assert.strictEqual(getResponse.header['content-type'], 'application/json; charset=utf-8');
    assert.strictEqual(getResponse.body.message, 'Hello, world!');
    console.log(`${green}GET /api/example passed${reset}`);

    // Test POST /api/example
    const postResponse = await request(app)
      .post('/api/example')
      .send({ name: 'Alice' });
    assert.strictEqual(postResponse.status, 201);
    assert.strictEqual(postResponse.header['content-type'], 'application/json; charset=utf-8');
    assert.strictEqual(postResponse.body.message, 'Hello, Alice!');
    console.log(`${green}POST /api/example passed${reset}`);

  } catch (error) {
    console.error(`${red}Test failed: ${error.message}${reset}`);
  }
}

runTests();
