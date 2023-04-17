import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

describe('App', () => {
  it('should respond with a 200 status for the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});

afterAll(async () => {
  await mongoose.disconnect(); // Disconnect from MongoDB after all tests are completed
});
