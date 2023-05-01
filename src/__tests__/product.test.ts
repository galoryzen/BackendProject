import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectDB } from '../db';
import { Product } from '../models/productModel';

let restaurant: any;

beforeAll(async () => {
    await connectDB();
    await Product.deleteMany({});

    //create a restaurant for testing
    const restaurantResponse = await request(app)
        .post('/restaurant')
        .send({
            name: 'Test Restaurant Product',
            address: 'Test Address',
            category: 'Test Category',
        });

    restaurant = restaurantResponse.body;
});

describe('Product routes', () => {
    let sampleProduct = {
        name: 'Test Product',
        price: 5.99,
        restaurant: 'test-restaurant-id',
        category: 'Test Category',
        status: true
    };

    describe('POST /product', () => {
        it('should create a new product', async () => {
            sampleProduct = { ...sampleProduct, restaurant: restaurant._id };
            const response = await request(app)
                .post('/product')
                .send(sampleProduct);

            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(sampleProduct);
        });
    });

    describe('GET /product', () => {
        it('should get all products from a restaurant', async () => {
            const response = await request(app).get(`/product/restaurant/${restaurant._id}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(1);
        });

        it('should get products by restaurant and/or category', async () => {
            const response = await request(app).get(`/product/restaurant/${restaurant._id}`).query({ category: restaurant.category });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /product/search/:id', () => {
        it('should get a product by id', async () => {
            const createResponse = await request(app)
                .post('/product')
                .send(sampleProduct);

            const response = await request(app).get(`/product/search/${createResponse.body._id}`);

            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(sampleProduct);
        });

        it('should return 404 if the product is not found', async () => {
            const invalidId = mongoose.Types.ObjectId;
            const response = await request(app).get(`/product/search/${invalidId}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /product/:id', () => {
        it('should update a product', async () => {
            const createResponse = await request(app)
                .post('/product')
                .send(sampleProduct);

            const updatedProduct = {
                name: 'Updated Product',
                price: 9.99,
                restaurant: restaurant._id,
                category: 'Updated Category',
                status: false
            };

            const updateResponse = await request(app)
                .patch(`/product/${createResponse.body._id}`)
                .send(updatedProduct);

            expect(updateResponse.status).toBe(200);
            expect(updateResponse.body).toMatchObject(updatedProduct);
        });

        it('should return 404 if the product is not found', async () => {
            const invalidId = mongoose.Types.ObjectId;
            const updateResponse = await request(app)
                .put(`/product/${invalidId}`)
                .send({ name: 'Not Existing Product' });

            expect(updateResponse.status).toBe(404);
        });
    });

    describe('DELETE /product/:id', () => {
        test('should soft delete a product', async () => {
            const createResponse = await request(app)
                .post('/product')
                .send(sampleProduct);

            const deleteResponse = await request(app).delete(`/product/${createResponse.body._id}`);

            expect(deleteResponse.status).toBe(200);
        });
        test('should return 404 if the product is not found', async () => {
            const invalidId = mongoose.Types.ObjectId;
            const deleteResponse = await request(app).delete(`/product/${invalidId}`);

            expect(deleteResponse.status).toBe(404);
        });
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});