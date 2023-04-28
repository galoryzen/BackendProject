import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectDB } from '../db';
import { Restaurant } from '../models/restaurantModel';

beforeAll(async () => {
    await connectDB();
    await Restaurant.deleteMany({});
});

describe('Restaurant routes', () => {
    const sampleRestaurant = {
        name: 'Test Restaurant',
        address: '123 Test Street',
        category: 'Test Category',
    };

    describe('POST /restaurant', () => {
        it('should create a new restaurant', async () => {
            const response = await request(app)
                .post('/restaurant')
                .send(sampleRestaurant);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(sampleRestaurant);
            expect(response.body.distance).toBeDefined();
        });
    });

    describe('GET /restaurant', () => {
        it('should get all restaurants', async () => {
            const response = await request(app).get('/restaurant');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(1);
        });

        it('should get restaurants by name or category', async () => {
            const response = await request(app).get('/restaurant').query({ name: 'Test Restaurant', category: 'Test Category' });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /restaurant/search/:id', () => {
        it('should get a restaurant by id', async () => {
            const createResponse = await request(app)
                .post('/restaurant')
                .send(sampleRestaurant);

            const response = await request(app).get(`/restaurant/search/${createResponse.body._id}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(sampleRestaurant);
        });

        it('should return 404 if the restaurant is not found', async () => {
            const invalidId = mongoose.Types.ObjectId;
            const response = await request(app).get(`/restaurant/search/${invalidId}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /restaurant/:id', () => {
        it('should update a restaurant', async () => {
            const createResponse = await request(app)
                .post('/restaurant')
                .send(sampleRestaurant);

            const updatedRestaurant = {
                name: 'Updated Restaurant',
                address: '456 Updated Street',
                category: 'Updated Category',
            };

            const updateResponse = await request(app)
                .patch(`/restaurant/${createResponse.body._id}`)
                .send(updatedRestaurant);

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body).toMatchObject(updatedRestaurant);
        });

        it('should return 404 if the restaurant is not found', async () => {
            const invalidId = mongoose.Types.ObjectId;
            const updateResponse = await request(app)
                .patch(`/restaurant/${invalidId}`)
                .send({ name: 'Not Existing Restaurant' });

            expect(updateResponse.status).toBe(404);
        });
    });

    describe('DELETE /restaurant/:id', () => {
        test('should soft delete a restaurant', async () => {
            const createResponse = await request(app)
                .post('/restaurant')
                .send(sampleRestaurant);

            const deleteResponse = await request(app).delete(`/restaurant/${createResponse.body._id}`);

            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.body.status).toBe(false);
        });

        test('should return 404 if the restaurant is not found', async () => {
            const invalidId = mongoose.Types.ObjectId;
            const deleteResponse = await request(app).delete(`/restaurant/${invalidId}`);

            expect(deleteResponse.status).toBe(404);
        });
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});
