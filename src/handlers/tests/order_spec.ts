import request from 'supertest';
import app from '../../server';
import { OrderStore } from '../../models/order';
import { UserStore } from '../../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const orderStore = new OrderStore();
const userStore = new UserStore();

let token: string;
let userId: number;
let orderId: number;

describe('Order Handler', () => {
  beforeAll(async () => {
    const user = await userStore.create({
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser_order',
      password: 'password123',
    });

    userId = user.id as number;
    token = jwt.sign({ user_id: userId }, process.env.TOKEN_SECRET as string);


    const order = await orderStore.create({
      user_id: userId,
      status: 'active',
    });

    orderId = order.id as number;
  });

  it('should create a new order', async () => {
    const newOrder = {
      user_id: userId,
      status: 'active',
    };

    const res = await request(app)
      .post('/orders')
      .send(newOrder)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.user_id).toBe(newOrder.user_id);
    expect(res.body.status).toBe(newOrder.status);

    // Save the order ID for use in later tests
    orderId = res.body.id;
  });

  it('should fetch an order by ID', async () => {
    const res = await request(app)
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(orderId);
  });

  it('should fetch all orders', async () => {
    const res = await request(app)
      .get('/orders')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete an order', async () => {
    const res = await request(app)
      .delete('/orders')
      .send({ id: orderId })
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(orderId);
  });

  afterAll(async () => {
    // Clean up after all tests
    await orderStore.delete(orderId);
    await userStore.delete(userId);
  });
});
