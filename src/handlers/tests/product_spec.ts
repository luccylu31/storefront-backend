import request from 'supertest';
import app from '../../server'; 
import { ProductStore } from '../../models/product';
import { Product } from '../../models/product';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const store = new ProductStore();

describe('Product Handler', () => {
  let token: string;
  let productId: number;

  beforeAll(async () => {
    token = jwt.sign({ user_id: 1 }, process.env.TOKEN_SECRET as string);
  });

  it('should create a new product', async () => {
    const newProduct: Product = {
      name: 'Test Product',
      price: 99.99,
      category: 'Test Category',
    };

    const res = await request(app)
      .post('/products')
      .send(newProduct)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.price).toBe(newProduct.price);
    expect(res.body.category).toBe(newProduct.category);

    productId = res.body.id;
  });

  it('should fetch a product by ID', async () => {
    const res = await request(app)
      .get(`/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productId);
  });

  it('should fetch all products', async () => {
    const res = await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete a product', async () => {
    const res = await request(app)
      .delete('/products')
      .send({ id: productId })
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productId);
  });

  afterAll(async () => {
    // await store.clear();
  });
});
