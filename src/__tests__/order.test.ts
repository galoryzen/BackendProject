import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectDB } from '../db';
import { Product } from '../models/productModel';
import { Order } from '../models/orderModel';

let restaurant: any;
let product: any;
let user: any;

beforeAll(async () => {
    await connectDB();
    await Order.deleteMany({});

    //create a restaurant for testing
    const restaurantResponse = await request(app)
        .post('/restaurant')
        .send({
            name: 'Test Restaurant Order',
            address: 'Test Address',
            category: 'Test Category',
        });

    restaurant = restaurantResponse.body;

    //create a product for testing
    const productResponse = await request(app)
        .post('/product')
        .send({
            name: 'Test Product',
            price: 5.99,
            restaurant: restaurant._id,
            category: 'Test Category',
        });

    product = productResponse.body;

    const userResponse = await request(app)
        .post('/user')
        .send({
            name: 'Test User Order',
            email: 'fwoiehf@goiren.com',
            password: 'testpassword',
            cellphone: 1234567890,
            address: 'Test Address',
        });

    user = userResponse.body;
});

describe('Order routes', () => {

    beforeEach(async () => {
        await Order.deleteMany({});
    });

    describe('POST /order', () => {
        it('should create a new order', async () => {
            const response = await request(app)
                .post('/order')
                .send({
                    restaurant: restaurant._id,
                    user: user._id,
                    items: [{ product: product._id, quantity: 1 }],
                })
                .expect(201);

            expect(response.body.restaurant).toEqual(restaurant._id);
            expect(response.body.user).toEqual(user._id);
            expect(response.body.items[0].product).toEqual(product._id);
            expect(response.body.items[0].quantity).toEqual(1);
            expect(response.body.deliveryStatus).toEqual('Creado');
        });
    });

    describe('GET /order/search/:id', () => {
        it('should return the order with the given id', async () => {
            let order = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
            });
            await order.save();

            const response = await request(app)
                .get(`/order/search/${order._id}`)
                .expect(200);

            expect(response.body._id).toEqual(order._id.toHexString());
        });

        it('should return 404 if the id is invalid', async () => {
            const response = await request(app)
                .get('/order/search/123')
                .expect(404);

            expect(response.text).toEqual('Invalid order ID');
        });

        it('should return 404 if the order does not exist', async () => {
            const response = await request(app)
                .get(`/order/search/${restaurant._id}`)
                .expect(404);

            expect(response.text).toEqual('Order not found');
        });
    });

    describe('GET /order', () => {
        it('should return all orders', async () => {
            const order1 = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
            });
            await order1.save();
            const order2 = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
            });
            await order2.save();

            const response = await request(app).get('/order').expect(200);

            expect(response.body.length).toEqual(2);
            expect(response.body[0]._id).toEqual(order1._id.toHexString());
            expect(response.body[1]._id).toEqual(order2._id.toHexString());
        });

        it('should filter orders by user', async () => {
            const user2Response = await request(app)
                .post('/user')
                .send({
                    name: 'Test User Order 2',
                    email: 'foiwejf@fklsdf.com',
                    password: 'testpassword',
                    cellphone: 1234567890,
                    address: 'Test Address',
                });

            const user2 = user2Response.body;


            const order1 = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
            });
            await order1.save();

            const order2 = new Order({
                restaurant: restaurant._id,
                user: user2._id,
                items: [{ product: product._id, quantity: 1 }],
            });
            await order2.save();

            const response = await request(app)
                .get('/order')
                .query({ user: user._id })
                .expect(200);

            expect(response.body.length).toEqual(1);
            expect(response.body[0]._id).toEqual(order1._id.toHexString());
        });

        it('should filter orders by restaurant', async () => {
            const restaurant2Response = await request(app)
                .post('/restaurant')
                .send({
                    name: 'Test Restaurant Order 2',
                    address: 'Test Address',
                    category: 'Test Category',
                });

            const restaurant2 = restaurant2Response.body;

            const order1 = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
            });
            await order1.save();

            const order2 = new Order({
                restaurant: restaurant2._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
            });
            await order2.save();

            const response = await request(app)
                .get('/order')
                .query({ restaurant: restaurant._id })
                .expect(200);

            expect(response.body.length).toEqual(1);
            expect(response.body[0]._id).toEqual(order1._id.toHexString());
        });

        it('should filter orders by date range', async () => {
            const order1 = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
            });
            order1.createdAt = new Date('2022-01-01T00:00:00Z');
            await order1.save();

            const order2 = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
            });
            order2.createdAt = new Date('2022-02-01T00:00:00Z');
            await order2.save();

            const response = await request(app)
                .get('/order')
                .query({
                    startDate: '2022-01-15',
                    endDate: '2022-02-15',
                })
                .expect(200);

            expect(response.body.length).toEqual(1);
            expect(response.body[0]._id).toEqual(order2._id.toHexString());
        });
    });

    describe('GET /order/enviados', () => {
        it('should return all orders with deliveryStatus: "Enviado"', async () => {
            const order1 = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
                deliveryStatus: 'Enviado',
            });
            await order1.save();

            const order2 = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
                deliveryStatus: 'Entregado',
            });
            await order2.save();

            const response = await request(app)
                .get('/order/enviados')
                .expect(200);

            expect(response.body.length).toEqual(1);
            expect(response.body[0]._id).toEqual(order1._id.toHexString());
        });
    });

    describe('PATCH /order/items/:id', () => {
        it('should update items of order with given id', async () => {
            const order = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
            });
            await order.save();

            const newProductResponse = await request(app)
                .post('/product')
                .send({
                    name: 'New Product',
                    price: 9.99,
                    restaurant: restaurant._id,
                    category: 'Test Category',
                });
            const newProduct = newProductResponse.body;

            const response = await request(app)
                .patch(`/order/items/${order._id}`)
                .send({
                    items: [
                        { product: newProduct._id, quantity: 1 },
                        { product: product._id, quantity: 2 },
                    ],
                })
                .expect(200);

            expect(response.body._id).toEqual(order._id.toHexString());
            expect(response.body.items.length).toEqual(2);
        });

        it('should return 404 if order with given id does not exist', async () => {
            await request(app)
                .patch(`/order/items/60686c90cf6a881ec6c41f01`)
                .send({
                    items: [{ product: product._id, quantity: 1 }],
                })
                .expect(404);
        });

        it('should return 404 if order is not in "Creado" status', async () => {
            const order = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
                deliveryStatus: 'Enviado',
            });
            await order.save();

            await request(app)
                .patch(`/order/items/${order._id}`)
                .send({
                    items: [{ product: product._id, quantity: 1 }],
                })
                .expect(404);
        });
    });

    describe('PATCH /order/status/:id', () => {
        it('should update deliveryStatus of order with given id', async () => {
            const order = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
                deliveryStatus: 'Creado',
            });
            await order.save();
            const response = await request(app)
                .patch(`/order/status/${order._id}`)
                .send({
                    deliveryStatus: 'Enviado',
                })
                .expect(200);
            expect(response.body._id).toEqual(order._id.toHexString());
            expect(response.body.deliveryStatus).toEqual('Enviado');
        });

        it('should return 404 if order with given id does not exist', async () => {
            await request(app)
                .patch(`/order/status/60686c90cf6a881ec6c41f01`)
                .send({
                    deliveryStatus: 'Enviado',
                })
                .expect(404);
        });
    });

    describe('DELETE /order/:id', () => {
        it('should delete order with given id', async () => {
            const order = new Order({
                restaurant: restaurant._id,
                user: user._id,
                items: [{ product: product._id, quantity: 1 }],
            });
            await order.save();
            await request(app)
                .delete(`/order/${order._id}`)
                .expect(200);

            const foundOrder = await Order.findById(order._id);
            expect(foundOrder).toBeNull();
        });

        it('should return 404 if order with given id does not exist', async () => {
            await request(app)
                .delete(`/order/60686c90cf6a881ec6c41f01`)
                .expect(404);
        });
    });

});

afterAll(async () => {
    await mongoose.disconnect();
});