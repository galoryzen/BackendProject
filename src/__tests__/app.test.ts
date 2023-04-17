import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectDB } from '../db';

beforeAll(async () => {
  await connectDB();
});

describe('App', () => {
  //test to see if the app is connected to the database
  it('should connect to the database', async () => {
    const response = await mongoose.connection.readyState;
    expect(response).toBe(1);
  });

  it('should respond with a 200 status for the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello World!');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
