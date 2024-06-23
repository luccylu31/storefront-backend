import express, { Request, Response } from 'express';
import { OrderStore, Order } from '../models/order';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { verifyAuthToken } from '../middlewares/auth';

dotenv.config();

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(parseInt(req.params.id));
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
    jwt.verify(token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401).json('Access denied, invalid token');
    return;
  }

  try {
    const order: Omit<Order, 'id'> = {
      user_id: req.body.user_id,
      status: req.body.status,
    };

    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
    jwt.verify(token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    res.status(401).json('Access denied, invalid token');
    return;
  }

  try {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/orders', verifyAuthToken, index);
  app.get('/orders/:id', verifyAuthToken, show);
  app.post('/orders', verifyAuthToken, create);
  app.delete('/orders', verifyAuthToken, destroy);
};

export default orderRoutes;
