
const request = require('supertest');
const { test, expect } = require('@jest/globals');

// setup a dummy test that will always pass
test('dummy test', () => {
    expect(1).toBe(1);
});