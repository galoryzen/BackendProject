import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectDB } from '../db';
import { User } from '../models/userModel';

beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
});

describe('User routes', () => {

    const validUser = {
        email: 'testuser@test.com',
        name: 'Test User',
        password: 'test123',
        cellphone: 1234567890,
        address: 'Test Address',
    };

    const invalidUser = {
        email: 'testuser@test.com',
        name: 'Test User',
        password: 'test',
        cellphone: '1234567890',
        address: 'Test Address',
    };

    describe('POST /user', () => {
        it('should create a new user', async () => {
            const response = await request(app)
                .post('/user')
                .send(validUser)
                .expect(201);

            expect(response.body).toMatchObject(validUser);
        });

        it('should return an error for invalid user data', async () => {
            const response = await request(app)
                .post('/user')
                .send(invalidUser)
                .expect(500);

            expect(response.body.name).toBe('TypeboxError');
        });
    });

    describe('GET /user', () => {
        it('should get a user by email and password', async () => {
            const response = await request(app)
                .get('/user')
                .query({ email: validUser.email, password: validUser.password })
                .expect(200);

            expect(response.body).toMatchObject(validUser);
        });

        it('should get a user by userId', async () => {
            const createUserResponse = await request(app)
                .post('/user')
                .send({ ...validUser, email: validUser.email + '2' })
                .expect(201);

            const createdUser = createUserResponse.body;

            const response = await request(app)
                .get(`/user?userId=${createdUser._id}`)
                .expect(200);

            expect(response.body).toMatchObject(createdUser);
        });

        it('should return an error for invalid query parameters', async () => {
            const response = await request(app)
                .get('/user')
                .query({ invalidParam: 'test' })
                .expect(400);

            expect(response.body.error).toBeDefined();
        });

        it('should return an error if user not found', async () => {
            const response = await request(app)
                .get('/user')
                .query({ email: 'nonexisting@test.com', password: 'test123' })
                .expect(404);

            expect(response.body.error).toBeDefined();
        });
    });

    describe('GET /user/all', () => {
        it('should get all users', async () => {
            const response = await request(app)
                .get('/user/all')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('PATCH /user/:id', () => {
        it('should update a user', async () => {
            const createUserResponse = await request(app)
                .post('/user')
                .send({ ...validUser, email: validUser.email + '3' })
                .expect(201);

            const createdUser = createUserResponse.body;

            const updatedUser = {
                ...createdUser,
                name: 'New Name',
            };

            const response = await request(app)
                .patch(`/user/${createdUser._id}`)
                .send(updatedUser)
                .expect(200);

            expect(response.body.name).toBe(updatedUser.name);
        });

        it('should return an error for invalid user ID', async () => {
            const response = await request(app)
                .patch('/user/invalidid')
                .send(validUser)
                .expect(404);
            expect(response.text).toBe('Invalid user ID');
        });

        it('should return an error if user not found', async () => {
            const response = await request(app)
                .patch('/user/616b267a0d5416d46c6ab5b5')
                .send(validUser)
                .expect(404);

            expect(response.text).toBe('User not found');
        });
    });

    describe('DELETE /user/:id', () => {
        it('should soft delete a user', async () => {
            const createUserResponse = await request(app)
                .post('/user')
                .send({ ...validUser, email: validUser.email + '4' })
                .expect(201);
            const createdUser = createUserResponse.body;

            const response = await request(app)
                .delete(`/user/${createdUser._id}`)
                .expect(200);

            expect(response.body.status).toBe(false);
        });

        it('should return an error for invalid user ID', async () => {
            const response = await request(app)
                .delete('/user/invalidid')
                .expect(404);

            expect(response.text).toBe('Invalid user ID');
        });

        it('should return an error if user not found', async () => {
            const response = await request(app)
                .delete('/user/616b267a0d5416d46c6ab5b5')
                .expect(404);

            expect(response.text).toBe('User not found');
        });
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});
